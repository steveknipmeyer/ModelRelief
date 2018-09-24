% Box Blur Demo

gaussianKernelStd = 9.6;
gaussianKernelVar = gaussianKernelStd * gaussianKernelStd;
gaussianKernelRadius = ceil(6 * gaussianKernelStd);
gaussianKernel = exp(-([-gaussianKernelRadius:gaussianKernelRadius] .^ 2) / (2 * gaussianKernelVar));
gaussianKernel = gaussianKernel / sum(gaussianKernel);

boxBlurKernel = GenerateBoxBlurKernel(gaussianKernelVar, 6);
boxBlurKernelRadius = (length(boxBlurKernel) - 1) / 2;

figure();
plot([-gaussianKernelRadius:gaussianKernelRadius], gaussianKernel, [-boxBlurKernelRadius:boxBlurKernelRadius], boxBlurKernel);

sum(([-boxBlurKernelRadius:boxBlurKernelRadius] .^ 2) .* boxBlurKernel)
sum(([-gaussianKernelRadius:gaussianKernelRadius] .^ 2) .* gaussianKernel)