
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, Color, Vector2 } from 'three';

interface DayNightSceneProps {
    backgroundColor: Color;
}

const DayNightScene: React.FC<DayNightSceneProps> = ({ backgroundColor }) => {
    const materialRef = useRef<any>(null);

    // Enhanced aviation-based time schemes with research-backed hex values
    const gradientColors = useMemo(() => {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const timeDecimal = currentHour + currentMinute / 60;

        // Aircraft-view sky gradients based on atmospheric scattering research
        const timeSchemes = {
            preDawn: { // 4-5 AM - Deep twilight from aircraft
                top: '#022660', // Cool Black (deep space view)
                upper: '#0D469D', // Yale Blue (upper atmosphere)
                middle: '#6D54A9', // Royal Purple (atmospheric layer)
                lower: '#CE75C2', // Deep Mauve (horizon glow)
                bottom: '#E5C7BB' // Desert Sand (earth reflection)
            },
            dawn: { // 5-7 AM - Golden hour from altitude
                top: '#1C3C6C', // Deep blue (high altitude view)
                upper: '#2B4D68', // Atmospheric blue
                middle: '#337882', // Teal transition
                lower: '#E49759', // Dawn orange (research-backed)
                bottom: '#F7CD5D' // Sunrise yellow (research-backed)
            },
            sunrise: { // 7-9 AM - Full sunrise spectrum
                top: '#4E518B', // Twilight purple
                upper: '#FF6B3E', // Vibrant orange (sky high palette)
                middle: '#F7C16A', // Golden yellow
                lower: '#FFEF7A', // Bright yellow
                bottom: '#B5D6E0' // Light blue horizon
            },
            morning: { // 9-11 AM - Clear morning sky
                top: '#2F3B62', // Twilight blue
                upper: '#4682B4', // Steel blue
                middle: '#87CEEB', // Sky blue
                lower: '#B0E0E6', // Powder blue
                bottom: '#F0F8FF' // Alice blue
            },
            midday: { // 11 AM - 2 PM - High altitude blue
                top: '#191970', // Midnight blue (space view)
                upper: '#4169E1', // Royal blue
                middle: '#6495ED', // Cornflower blue
                lower: '#87CEFA', // Light sky blue
                bottom: '#E0F6FF' // Very light blue
            },
            afternoon: { // 2-5 PM - Afternoon haze
                top: '#483D8B', // Dark slate blue
                upper: '#5F9EA0', // Cadet blue
                middle: '#ADD8E6', // Light blue
                lower: '#F5F5DC', // Beige (atmospheric haze)
                bottom: '#FFF8DC' // Cornsilk
            },
            preEvening: { // 5-6 PM - Pre-golden hour
                top: '#6A5ACD', // Slate blue
                upper: '#FF8C00', // Dark orange
                middle: '#FFA500', // Orange
                lower: '#FFD700', // Gold
                bottom: '#FFFFE0' // Light yellow
            },
            goldenHour: { // 6-8 PM - Aviation golden hour
                top: '#4E5978', // Purple navy (dusk palette)
                upper: '#D46671', // Fuzzy wuzzy
                middle: '#E79C63', // Earth yellow
                lower: '#FF6B3E', // Orange red (sunset palette)
                bottom: '#FFA700' // Orange (sunrise palette)
            },
            sunset: { // 8-9 PM - Full sunset from aircraft
                top: '#27214E', // Deep purple (high altitude)
                upper: '#5B2C6F', // Purple (sunset palette)
                middle: '#E74C3C', // Red
                lower: '#F39C12', // Orange
                bottom: '#F7DC6F' // Yellow
            },
            dusk: { // 9-10 PM - Twilight colors
                top: '#301748', // Dark purple (night palette)
                upper: '#7E5072', // Twilight lavender
                middle: '#AB5A74', // China rose
                lower: '#E27E7E', // New York pink
                bottom: '#EA9E79' // Dark salmon
            },
            night: { // 10 PM - 4 AM - Night sky from altitude
                top: '#000000', // True black (space)
                upper: '#191970', // Midnight blue
                middle: '#2F2F4F', // Dark slate gray
                lower: '#483D8B', // Dark slate blue
                bottom: '#6A5ACD' // Slate blue
            }
        };

        // Smooth time-based transitions
        let scheme;
        if (timeDecimal >= 4 && timeDecimal < 5) scheme = timeSchemes.preDawn;
        else if (timeDecimal >= 5 && timeDecimal < 7) scheme = timeSchemes.dawn;
        else if (timeDecimal >= 7 && timeDecimal < 9) scheme = timeSchemes.sunrise;
        else if (timeDecimal >= 9 && timeDecimal < 11) scheme = timeSchemes.morning;
        else if (timeDecimal >= 11 && timeDecimal < 14) scheme = timeSchemes.midday;
        else if (timeDecimal >= 14 && timeDecimal < 17) scheme = timeSchemes.afternoon;
        else if (timeDecimal >= 17 && timeDecimal < 18) scheme = timeSchemes.preEvening;
        else if (timeDecimal >= 18 && timeDecimal < 20) scheme = timeSchemes.goldenHour;
        else if (timeDecimal >= 20 && timeDecimal < 21) scheme = timeSchemes.sunset;
        else if (timeDecimal >= 21 && timeDecimal < 22) scheme = timeSchemes.dusk;
        else scheme = timeSchemes.night;

        // Enhanced blending with user's background color
        const baseColor = backgroundColor.getHSL({ h: 0, s: 0, l: 0 });
        const blendFactor = 0.15; // Reduced to 15% for more realistic sky colors

        const blendColor = (timeColor: string) => {
            const tc = new Color(timeColor);
            const tcHSL = tc.getHSL({ h: 0, s: 0, l: 0 });

            return new Color().setHSL(
                baseColor.h * blendFactor + tcHSL.h * (1 - blendFactor),
                Math.min(baseColor.s * blendFactor + tcHSL.s * (1 - blendFactor), 1),
                Math.min(baseColor.l * blendFactor + tcHSL.l * (1 - blendFactor), 1)
            );
        };

        return {
            top: blendColor(scheme.top),
            upper: blendColor(scheme.upper),
            middle: blendColor(scheme.middle),
            lower: blendColor(scheme.lower),
            bottom: blendColor(scheme.bottom),
            timeDecimal
        };
    }, [backgroundColor]);

    // Enhanced interactive animated shader with more active atmospheric effects
    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 upperColor;
    uniform vec3 middleColor;
    uniform vec3 lowerColor;
    uniform vec3 bottomColor;
    uniform float time;
    uniform vec2 mouse;
    uniform float timeDecimal;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    // Enhanced noise functions for more active animations
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    }

    // More active smooth noise with time variation
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Enhanced 3D noise for atmospheric depth
    float smoothNoise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      return mix(
        mix(
          mix(noise(i), noise(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(noise(i + vec3(0.0, 1.0, 0.0)), noise(i + vec3(1.0, 1.0, 0.0)), f.x),
          f.y
        ),
        mix(
          mix(noise(i + vec3(0.0, 0.0, 1.0)), noise(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(noise(i + vec3(0.0, 1.0, 1.0)), noise(i + vec3(1.0, 1.0, 1.0)), f.x),
          f.y
        ),
        f.z
      );
    }

    // Enhanced FBM with more octaves for richer detail
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 6; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.4;
        frequency *= 2.1;
      }

      return value;
    }

    // 3D FBM for volumetric effects
    float fbm3D(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise3D(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }

      return value;
    }

    // Active atmospheric scattering simulation
    vec3 atmosphericScattering(vec3 color, float height) {
      float rayleigh = exp(-height * 2.0) * 0.3;
      float mie = exp(-height * 0.8) * 0.1;

      vec3 scatteredColor = color;
      scatteredColor.b += rayleigh * sin(time * 0.5 + height * 10.0) * 0.2;
      scatteredColor.rg += mie * sin(time * 0.3 + height * 8.0) * 0.1;

      return scatteredColor;
    }

    void main() {
      vec2 uv = vUv;

      // Enhanced interactive mouse effects with more movement
      vec2 mouseInfluence = mouse * 0.3;
      float mouseDistance = length(mouse);
      uv += mouseInfluence * sin(time * 2.0 + mouseDistance * 5.0) * 0.05;

      // Multiple active atmospheric layers with different speeds
      vec3 worldPos = vWorldPosition * 0.01;
      float cloudLayer1 = fbm(uv * 4.0 + time * 0.3);
      float cloudLayer2 = fbm(uv * 8.0 - time * 0.2);
      float cloudLayer3 = fbm3D(worldPos + time * 0.1);
      float windLayer = fbm(uv * 6.0 + vec2(time * 0.4, time * 0.1));

      // Active atmospheric turbulence with multiple effects
      float atmosphericTurbulence = (cloudLayer1 * 0.4 + cloudLayer2 * 0.3 + cloudLayer3 * 0.2 + windLayer * 0.1) * 0.15;

      // Enhanced dynamic movement
      float verticalWave = sin(uv.x * 8.0 + time * 1.5) * 0.02;
      float horizontalWave = cos(uv.y * 6.0 + time * 1.2) * 0.01;
      float dynamicY = uv.y + atmosphericTurbulence + verticalWave + horizontalWave;

      vec3 color;

      // Enhanced five-layer gradient with active transitions
      if (dynamicY > 0.8) {
        float factor = (dynamicY - 0.8) * 5.0;
        factor += sin(time * 0.8 + uv.x * 10.0) * 0.1;
        color = mix(upperColor, topColor, smoothstep(0.0, 1.0, factor));
      } else if (dynamicY > 0.6) {
        float factor = (dynamicY - 0.6) * 5.0;
        factor += cos(time * 0.6 + uv.y * 8.0) * 0.08;
        color = mix(middleColor, upperColor, smoothstep(0.0, 1.0, factor));
      } else if (dynamicY > 0.4) {
        float factor = (dynamicY - 0.4) * 5.0;
        factor += sin(time * 0.4 + (uv.x + uv.y) * 6.0) * 0.06;
        color = mix(lowerColor, middleColor, smoothstep(0.0, 1.0, factor));
      } else if (dynamicY > 0.2) {
        float factor = (dynamicY - 0.2) * 5.0;
        factor += cos(time * 0.5 + uv.x * 12.0) * 0.04;
        color = mix(bottomColor, lowerColor, smoothstep(0.0, 1.0, factor));
      } else {
        color = bottomColor;
      }

      // Enhanced atmospheric scattering with active effects
      color = atmosphericScattering(color, dynamicY);

      // Active scattering effects with multiple frequencies
      float scattering1 = 1.0 + sin(time * 0.7 + uv.y * 8.0) * 0.08;
      float scattering2 = 1.0 + cos(time * 0.9 + uv.x * 6.0) * 0.06;
      float scattering3 = 1.0 + sin(time * 0.5 + length(uv - 0.5) * 12.0) * 0.04;
      color *= scattering1 * scattering2 * scattering3;

      // Enhanced time-based color temperature shifts with more variation
      float temperatureShift = sin(timeDecimal * 0.26) * 0.15 + sin(time * 0.1) * 0.05;
      color.r += temperatureShift * 0.12;
      color.b -= temperatureShift * 0.08;
      color.g += temperatureShift * 0.03;

      // More active interactive color mixing
      vec2 center = vec2(0.5, 0.5);
      float distanceFromCenter = length(uv - center - mouseInfluence);
      float interactiveInfluence = exp(-distanceFromCenter * 2.0) * 0.4;
      interactiveInfluence *= (1.0 + sin(time * 3.0) * 0.3);

      // Dynamic color temperature interaction with mouse
      vec3 warmEffect = vec3(1.3, 1.1, 0.7);
      vec3 coolEffect = vec3(0.8, 0.9, 1.2);
      vec3 temperatureEffect = mix(coolEffect, warmEffect, mouseDistance * 0.5 + sin(time * 0.8) * 0.3);
      color.rgb = mix(color.rgb, color.rgb * temperatureEffect, interactiveInfluence);

      // Add subtle aurora-like effects during certain times
      if (timeDecimal < 6.0 || timeDecimal > 20.0) {
        float aurora = sin(uv.x * 15.0 + time * 2.0) * cos(uv.y * 10.0 + time * 1.5) * 0.1;
        aurora *= smoothstep(0.3, 0.7, uv.y);
        vec3 auroraColor = mix(vec3(0.0, 1.0, 0.5), vec3(0.5, 0.0, 1.0), sin(time * 0.5) * 0.5 + 0.5);
        color += auroraColor * aurora * 0.3;
      }

      // Final color enhancement with active brightness variation
      float brightness = 1.0 + sin(time * 0.3 + length(vWorldPosition) * 0.1) * 0.1;
      color *= brightness;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

    // Enhanced animation loop with more dynamic effects
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;

            // Enhanced mouse interaction with momentum
            const mouse = state.mouse;
            const targetX = mouse.x;
            const targetY = mouse.y;

            // Smooth mouse following with some momentum
            materialRef.current.uniforms.mouse.value.lerp(
                new Vector2(targetX, targetY),
                0.05
            );
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            side={BackSide}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
                topColor: { value: gradientColors.top },
                upperColor: { value: gradientColors.upper },
                middleColor: { value: gradientColors.middle },
                lowerColor: { value: gradientColors.lower },
                bottomColor: { value: gradientColors.bottom },
                time: { value: 0 },
                mouse: { value: new Vector2(0, 0) },
                timeDecimal: { value: gradientColors.timeDecimal }
            }}
        />
    );
};

export default DayNightScene;
