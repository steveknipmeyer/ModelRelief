function [ vBoxBlurKernel ] = GenerateBoxBlurKernel( boxBlurVar, numIterations )
% ----------------------------------------------------------------------------------------------- %
% [ boxBlurKernel ] = GenerateBoxBlurKernel( boxBlurVar, numIterations )
%   Approximates 1D Gaussian Kernel by iterative convolutions of "Extended Box Filter".
% Input:
%   - boxBlurVar        -   BoxFilter Varaiance.
%                           The variance of the output Box Filter.
%                           Scalar, Floating Point (0, inf).
%   - numIterations     -   Number of Iterations.
%                           The number of convolution iterations in order
%                           to produce the output Box Filter.
%                           Scalar, Floating Point [1, inf), Integer.
% Output:
%   - vBoxBlurKernel    -   Output Box Filter.
%                           The Box Filter with 'boxBlurVar' Variance.
%                           Vector, Floating Point, (0, 1).
% Remarks:
%   1.  The output Box Filter has a variance of '' as if it is treated as
%       Discrete Probability Function.
%   2.  References: "Theoretical Foundations of Gaussian Convolution by Extended Box Filtering"
%   3.  Prefixes:
%       -   'm' - Matrix.
%       -   'v' - Vector.
% TODO:
%   1.  F
%   Release Notes:
%   -   1.0.001     07/05/2014  xxxx xxxxxx
%       *   Accurate calculation of the "Extended Box Filter" length as in
%           the reference.
%   -   1.0.000     06/05/2014  xxxx xxxxxx
%       *   First release version.
% ----------------------------------------------------------------------------------------------- %

boxBlurLength = sqrt(((12 * boxBlurVar) / numIterations) + 1);
boxBlurRadius = (boxBlurLength - 1) / 2;

% 'boxBlurRadiusInt' -> 'l' in the reference
boxBlurRadiusInt    = floor(boxBlurRadius);
% boxBlurRadiusFrac   = boxBlurRadius - boxBlurRadiusInt;

% The length of the "Integer" part of the filter.
% 'boxBlurLengthInt' -> 'L' in the reference
boxBlurLengthInt = 2 * boxBlurRadiusInt + 1;

a1 = ((2 * boxBlurRadiusInt) + 1);
a2 = (boxBlurRadiusInt * (boxBlurRadiusInt + 1)) - ((3 * boxBlurVar) / numIterations);
a3 = (6 * ((boxBlurVar / numIterations) - ((boxBlurRadiusInt + 1) ^ 2)));

alpha = a1 * (a2 / a3);
ww = alpha / ((2 * boxBlurRadiusInt) + 1 + (2 * alpha));

% The length of the "Extended Box Filter".
% 'boxBlurLength' -> '\Gamma' in the reference.
boxBlurLength = (2 * (alpha + boxBlurRadiusInt)) + 1;

% The "Single Box Filter" with Varaince - boxBlurVar / numIterations
% It is normalized by definition.
vSingleBoxBlurKernel = [ww, (ones(1, boxBlurLengthInt) / boxBlurLength), ww];
% vBoxBlurKernel = vBoxBlurKernel / sum(vBoxBlurKernel);

vBoxBlurKernel = vSingleBoxBlurKernel;

% singleBoxKernelVar = sum(([-(boxBlurRadiusInt + 1):(boxBlurRadiusInt + 1)] .^ 2) .* boxBlurKernel)
% boxKernelVar = numIterations * singleBoxKernelVar


for iIter = 2:numIterations
    vBoxBlurKernel = conv2(vBoxBlurKernel, vSingleBoxBlurKernel, 'full');
end


end
