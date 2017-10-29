Math.clamp = function(pValue, pMin, pMax){
	return Math.max(Math.min(pValue, pMax), pMin);
}

Math.lerp = function(pStart, pEnd, pRatio){
	pRatio = Math.clamp(pRatio, 0, 1);
	return pStart + (pEnd - pStart) * pRatio
}