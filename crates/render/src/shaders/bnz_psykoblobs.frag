#version 450
layout(location = 0) out vec4 fragColor;

layout(set = 0, binding = 0) uniform Uniforms {
    vec2 iResolution;
    float iTime;
};
layout(set = 0, binding = 1) texture2D iChannel0;
layout(set = 0, binding = 2) sampler sChannel0;

vec4 textureHelper(texture2D tex, sampler samp, vec2 uv) {
    return texture(sampler2D(tex, samp), uv);
}

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float liquidNoise(vec2 p, float t) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

vec3 neonRainbowPalette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(2.0, 1.0, 2.0); 
    vec3 d = vec3(0.0, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 catUV = (uv - 0.5) * 1.3 + 0.5;
    
    float currentFrame = floor(mod(iTime * 12.0, 6.0));
    catUV.x = (fract(catUV.x) + currentFrame) / 6.0;
    
    vec4 textureColor = vec4(0.0);
    if(uv.x > 0.12 && uv.x < 0.88 && uv.y > 0.15 && uv.y < 0.85) {
        textureColor = textureHelper(iChannel0, sChannel0, catUV);
    }
    
    float catBrightness = dot(textureColor.rgb, vec3(0.299, 0.587, 0.114));
    
    vec2 aspectUV = uv;
    aspectUV.x *= iResolution.x / iResolution.y;
    float blobs = liquidNoise(aspectUV * 4.0, iTime * 0.5);
    
    float waves = cos(blobs * 42.0 + iTime * 1.5);
    float contourValue = (waves * 0.5 + 0.5);
    
    float catMask = textureColor.a;
    float mixedMap = mix(contourValue, contourValue + catBrightness * 1.5, catMask);
    
    vec3 finalColor = neonRainbowPalette(blobs * 1.0 + mixedMap * 0.4 + iTime * 0.1);
    finalColor = clamp(finalColor * 1.4, 0.0, 1.0);
    
    fragColor = vec4(finalColor, 1.0);
}
