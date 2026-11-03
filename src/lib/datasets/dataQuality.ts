import { DataColumn, QualityWarning } from '@/types';

export function analyzeDatasetQuality(
  rows: Record<string, any>[],
  columns: string[],
  targetColumn?: string
): { summaryColumns: DataColumn[]; warnings: QualityWarning[] } {
  const warnings: QualityWarning[] = [];
  const n = rows.length;

  if (n === 0) {
    return { summaryColumns: [], warnings: [] };
  }

  if (n < 15) {
    warnings.push({
      id: 'small-sample',
      level: 'warning',
      title: 'Small Sample Size (N < 15)',
      explanation: `Dataset contains only ${n} rows. High risk of overfitting and high evaluation variance on train/test splits.`,
      recommendedAction: 'Treat test metrics as illustrative; consider cross-validation or gathering more observations.',
    });
  }

  const summaryColumns: DataColumn[] = columns.map((col) => {
    let missingCount = 0;
    const values: any[] = [];
    let numericCount = 0;

    for (const r of rows) {
      const v = r[col];
      if (
        v === null ||
        v === undefined ||
        v === '' ||
        (typeof v === 'string' && v.trim() === '') ||
        (typeof v === 'number' && isNaN(v))
      ) {
        missingCount++;
      } else {
        values.push(v);
        if (
          typeof v === 'number' ||
          (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)) && !isNaN(parseFloat(v)))
        ) {
          numericCount++;
        }
      }
    }

    const isNumeric = numericCount > 0 && numericCount === values.length;
    const uniqueValues = Array.from(new Set(values));
    const uniqueCount = uniqueValues.length;
    const isIdentifier =
      col.toLowerCase().includes('id') && uniqueCount > 0 && (uniqueCount === values.length || uniqueCount === n);

    let min: number | undefined;
    let max: number | undefined;
    let mean: number | undefined;

    if (isNumeric && values.length > 0) {
      const numVals = values.map(Number);
      min = Math.min(...numVals);
      max = Math.max(...numVals);
      mean = Number((numVals.reduce((acc, v) => acc + v, 0) / numVals.length).toFixed(3));

      // Constant column check
      if (min === max && numVals.length > 1) {
        warnings.push({
          id: `constant-${col}`,
          level: 'critical',
          title: `Constant Feature: "${col}"`,
          explanation: `All values in "${col}" are identical (${min}). Zero information entropy; algorithms like PCA or Regression will encounter zero variance.`,
          recommendedAction: 'Exclude this column from feature inputs.',
        });
      }

      // Outlier check using 1.5 * IQR
      if (numVals.length >= 10) {
        const sorted = [...numVals].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = numVals.filter((v) => v < lowerBound || v > upperBound);

        if (outliers.length > 0) {
          warnings.push({
            id: `outlier-${col}`,
            level: 'info',
            title: `Detected Outliers in "${col}"`,
            explanation: `Found ${outliers.length} values outside 1.5×IQR range (bounds: [${lowerBound.toFixed(1)}, ${upperBound.toFixed(1)}]). Outliers heavily distort OLS slope and K-means centroids.`,
            recommendedAction: 'Inspect residual plots or apply robust scaling / filtering in preprocessor.',
          });
        }
      }
    }

    // Missing value check with semantic awareness (numeric vs text/categorical)
    if (missingCount > 0) {
      const pct = Number(((missingCount / n) * 100).toFixed(1));
      if (isNumeric) {
        warnings.push({
          id: `missing-${col}`,
          level: pct > 20 ? 'critical' : 'warning',
          title: `Missing Values in "${col}" (${pct}%) [Numeric]`,
          explanation: `${missingCount} out of ${n} entries are empty. Standard matrix operations (distance, covariance) will fail without imputation or exclusion.`,
          recommendedAction: 'Configure mean/median imputation or drop rows in the Preprocessing Studio.',
        });
      } else {
        warnings.push({
          id: `missing-${col}`,
          level: pct > 25 ? 'critical' : 'warning',
          title: `Missing Values in "${col}" (${pct}%) [Categorical/Text]`,
          explanation: `${missingCount} out of ${n} entries are empty in non-numeric column.`,
          recommendedAction:
            pct > 25
              ? 'High missingness in text feature. Recommend dropping this column or imputing with placeholder "Unknown". (Note: Mean/median is mathematically undefined for text).'
              : 'Impute missing entries with the mode (most frequent) or placeholder "Unknown", or drop empty rows. (Note: Mean/median is undefined for text).',
        });
      }
    }

    return {
      name: col,
      type: isIdentifier ? 'identifier' : isNumeric ? 'numeric' : 'categorical',
      missingCount,
      uniqueCount,
      min,
      max,
      mean,
      sampleValues: values.slice(0, 5),
    };
  });

  // Check if dataset has sufficient numeric features for geometric algorithms
  const numericCount = summaryColumns.filter((c) => c.type === 'numeric').length;
  if (numericCount < 2 && summaryColumns.length > 0) {
    warnings.unshift({
      id: 'few-numeric-features',
      level: 'warning',
      title: `Few Quantitative Features (${numericCount} numeric of ${summaryColumns.length} total)`,
      explanation: `Dataset is primarily text/categorical. 2D K-Means Voronoi clustering and OLS Regression require at least two quantitative numeric coordinates (x, y ∈ ℝ).`,
      recommendedAction:
        'Select numerical columns (e.g. release_year) or encode categorical values into numeric coordinates.',
    });
  }

  // Class Imbalance Check if target is categorical
  if (targetColumn) {
    const targetColMeta = summaryColumns.find((c) => c.name === targetColumn);
    if (targetColMeta && targetColMeta.type === 'categorical') {
      const counts: Record<string, number> = {};
      rows.forEach((r) => {
        const val = String(r[targetColumn]);
        counts[val] = (counts[val] || 0) + 1;
      });
      const freqs = Object.values(counts);
      const minClass = Math.min(...freqs);
      const maxClass = Math.max(...freqs);

      if (maxClass / (minClass || 1) >= 4) {
        warnings.push({
          id: 'imbalance',
          level: 'warning',
          title: `Severe Class Imbalance in Target "${targetColumn}"`,
          explanation: `Dominant class is ${(maxClass / (minClass || 1)).toFixed(1)}× larger than minority class. Raw accuracy will be misleadingly high.`,
          recommendedAction: 'Evaluate using Precision-Recall curve and F1 score instead of pure accuracy.',
        });
      }
    }
  }

  return { summaryColumns, warnings };
}
