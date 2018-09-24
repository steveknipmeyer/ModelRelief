%https://stackoverflow.com/questions/8204645/implementing-gaussian-blur-how-to-calculate-convolution-matrix-kernel

clear
close all

sigma = 4;
kernelSize = 21;

kernelMaximumIndex = (kernelSize - 1) / 2;
kernelRange = -kernelMaximumIndex:kernelMaximumIndex

[x, y] = meshgrid(kernelRange, kernelRange);

gaussian = exp(- (x.^2+y.^2) / (2*sigma^2));

gaussianNormalized = gaussian ./ sum(gaussian(:));

figure()
subplot(1, 2, 1)
surf(x, y, gaussian);

subplot(1, 2, 2)
surf(x, y, gaussianNormalized);

