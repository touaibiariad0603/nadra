import type { StatisticalResult, StudyVariable } from '@/types';

/**
 * Calculate the mean (average) of an array of numbers
 * @param values Array of numbers
 * @returns The arithmetic mean
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate the standard deviation of an array of numbers
 * @param values Array of numbers
 * @param sample Whether this is a sample (n-1) or population (n)
 * @returns The standard deviation
 */
export function calculateStdDev(values: number[], sample: boolean = true): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const n = sample ? values.length - 1 : values.length;
  
  if (n === 0) return 0;
  
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
  return Math.sqrt(variance);
}

/**
 * Calculate the paired t-test statistic for pre/post measurements
 * @param preValues Array of pre-test values
 * @param postValues Array of post-test values
 * @returns Object containing t-statistic, degrees of freedom, and p-value
 * 
 * Note: The p-value calculation uses an approximation of the t-distribution.
 * For production use with critical research, replace with a statistical library
 * like 'jstat' or 'simple-statistics' for more accurate p-values.
 */
export function calculatePairedTTest(preValues: number[], postValues: number[]): {
  tStatistic: number;
  degreesOfFreedom: number;
  pValue: number;
  meanDifference: number;
  stdDevDifference: number;
} {
  if (preValues.length !== postValues.length || preValues.length === 0) {
    return {
      tStatistic: 0,
      degreesOfFreedom: 0,
      pValue: 1,
      meanDifference: 0,
      stdDevDifference: 0,
    };
  }

  // Calculate differences (post - pre)
  const differences = postValues.map((post, i) => post - preValues[i]);
  
  // Mean of differences
  const meanDiff = calculateMean(differences);
  
  // Standard deviation of differences
  const stdDevDiff = calculateStdDev(differences, true);
  
  // Degrees of freedom
  const df = differences.length - 1;
  
  // t-statistic: t = mean_diff / (std_dev_diff / sqrt(n))
  const n = differences.length;
  const standardError = stdDevDiff / Math.sqrt(n);
  const tStatistic = standardError === 0 ? 0 : meanDiff / standardError;
  
  // Calculate p-value using approximation of t-distribution
  // This is a simplified approximation - for production, use a proper statistical library
  const pValue = approximatePValue(Math.abs(tStatistic), df);
  
  return {
    tStatistic,
    degreesOfFreedom: df,
    pValue,
    meanDifference: meanDiff,
    stdDevDifference: stdDevDiff,
  };
}

/**
 * Approximate p-value from t-statistic using the t-distribution
 * 
 * IMPORTANT: This is a simplified approximation using the normal distribution
 * as an approximation for large sample sizes. For small samples or production
 * research use, replace this with a proper t-distribution implementation.
 * 
 * Recommended libraries for accurate p-values:
 * - jstat: npm install jstat
 * - simple-statistics: npm install simple-statistics
 * - mathjs: npm install mathjs
 * 
 * @param tAbs Absolute value of t-statistic
 * @param df Degrees of freedom
 * @returns Approximate two-tailed p-value
 */
function approximatePValue(tAbs: number, df: number): number {
  // For large df (> 30), t-distribution approximates normal distribution
  // Using a more accurate approximation based on the t-distribution
  
  if (df <= 0) return 1;
  
  // Use the regularized incomplete beta function approximation
  // This is based on Abramowitz and Stegun's approximation
  
  const x = df / (df + tAbs * tAbs);
  
  // For a more accurate implementation, we use the normal approximation
  // with a correction factor for small sample sizes
  if (df >= 30) {
    // Normal approximation for large samples
    return 2 * (1 - normalCDF(tAbs));
  }
  
  // For smaller samples, use a better approximation
  // Based on the relationship between t and F distributions
  const a = df / 2;
  const b = 0.5;
  const p = regularizedIncompleteBeta(x, a, b);
  
  return p;
}

/**
 * Standard normal cumulative distribution function (CDF)
 * @param x Value
 * @returns Probability
 */
function normalCDF(x: number): number {
  // Approximation using the error function
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

/**
 * Error function approximation
 * @param x Value
 * @returns Error function value
 */
function erf(x: number): number {
  // Abramowitz and Stegun approximation 7.1.26
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

/**
 * Regularized incomplete beta function approximation
 * Used for calculating p-values from the t-distribution
 */
function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  // Simple approximation using continued fraction
  // For production use, consider using a more accurate implementation
  
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  // Use the relationship with the F-distribution
  // and approximate using the normal distribution for large df
  
  // This is a simplified approximation
  const mean = a / (a + b);
  const variance = (a * b) / ((a + b) * (a + b) * (a + b + 1));
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return x > mean ? 1 : 0;
  
  const z = (x - mean) / stdDev;
  return 1 - normalCDF(z);
}

/**
 * Calculate improvement percentage
 * @param preValue Pre-test value
 * @param postValue Post-test value
 * @returns Percentage improvement (positive = improvement)
 */
export function calculateImprovementPercentage(preValue: number, postValue: number): number {
  if (preValue === 0) return 0;
  return ((postValue - preValue) / Math.abs(preValue)) * 100;
}

/**
 * Analyze a single variable across all participants
 * @param variable The study variable
 * @param preValues Array of pre-test values
 * @param postValues Array of post-test values
 * @param significanceLevel Significance level (default: 0.05)
 * @returns Statistical result for this variable
 */
export function analyzeVariable(
  variable: StudyVariable,
  preValues: number[],
  postValues: number[],
  significanceLevel: number = 0.05
): StatisticalResult {
  const preMean = calculateMean(preValues);
  const postMean = calculateMean(postValues);
  const preStdDev = calculateStdDev(preValues);
  const postStdDev = calculateStdDev(postValues);
  
  const tTestResult = calculatePairedTTest(preValues, postValues);
  
  return {
    variable,
    preMean,
    postMean,
    preStdDev,
    postStdDev,
    meanDifference: tTestResult.meanDifference,
    improvementPercentage: calculateImprovementPercentage(preMean, postMean),
    tStatistic: tTestResult.tStatistic,
    pValue: tTestResult.pValue,
    isSignificant: tTestResult.pValue < significanceLevel,
    significanceLevel,
  };
}

/**
 * Get significance label in Arabic
 * @param pValue P-value
 * @param significanceLevel Significance level
 * @returns Arabic label for significance
 */
export function getSignificanceLabel(pValue: number, significanceLevel: number = 0.05): string {
  if (pValue < 0.001) return 'دال إحصائياً عند مستوى 0.001***';
  if (pValue < 0.01) return 'دال إحصائياً عند مستوى 0.01**';
  if (pValue < significanceLevel) return 'دال إحصائياً عند مستوى 0.05*';
  return 'غير دال إحصائياً';
}

/**
 * Get significance interpretation in Arabic
 * @param pValue P-value
 * @param variableName Name of the variable in Arabic
 * @returns Arabic interpretation text
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function interpretPValue(pValue: number, variableName: string): string {
  if (pValue < 0.001) {
    return `توجد فروق دالة إحصائياً عند مستوى (0.001) في متغير ${variableName} بين القياس القبلي والبعدي`;
  } else if (pValue < 0.01) {
    return `توجد فروق دالة إحصائياً عند مستوى (0.01) في متغير ${variableName} بين القياس القبلي والبعدي`;
  } else if (pValue < 0.05) {
    return `توجد فروق دالة إحصائياً عند مستوى (0.05) في متغير ${variableName} بين القياس القبلي والبعدي`;
  } else {
    return `لا توجد فروق دالة إحصائياً في متغير ${variableName} بين القياس القبلي والبعدي`;
  }
}