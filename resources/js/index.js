import jsVectorMap from 'jsvectormap';

/**
 * Initializes the world map widget with the given options.
 * @param {object} options - Options for initializing the map
 * @param {object} options.stats - The stats data, with country codes as keys and values as view counts
 * @param {string} options.tooltipText - Text to display next to the stats in the tooltip
 * @param {string} options.map - The name of the map to use
 * @param {string|null} options.customMapUrl - URL for a custom map script
 * @param {array} options.color - RGB array for the region color
 * @param {string} options.selector - The CSS selector for the HTML element to attach the map
 * @param {object} options.additionalOptions - Additional options to override or extend the default configuration
 */
import { loadScript } from './scriptLoader';

export default function initWorldMapWidget({ stats, tooltipText, map, customMapUrl = '', color, selector, additionalOptions = {} }) {
    return {
        stats,
        mapInstance: null,

        init() {
            const self = this;
            const defaultMapUrl = `https://raw.githubusercontent.com/themustafaomar/jsvectormap/master/src/maps/${map.replace(/_/g, '-')}.js`;
            const scriptUrl = typeof customMapUrl === 'string' && customMapUrl.trim() !== ''
                ? customMapUrl
                : defaultMapUrl;

            loadScript(scriptUrl, () => {
                self.renderMap();
            });
        },

        renderMap() {
            const self = this;
            const container = document.querySelector(selector);

            if (!container) {
                return;
            }

            if (self.mapInstance) {
                self.mapInstance.destroy();
                self.mapInstance = null;
            }

            container.innerHTML = '';

            const dataValues = self.stats;
            const values = Object.values(dataValues);
            const minValue = values.length ? Math.min(...values) : 0;
            const maxValue = values.length ? Math.max(...values) : 0;

            const normalizeOpacity = (value, min, max) =>
                min === max ? 1 : 0.3 + ((value - min) / (max - min)) * (1 - 0.3);

            const regionScales = Object.fromEntries(
                Object.entries(dataValues).map(([code, value]) => {
                    const opacity = normalizeOpacity(value, minValue, maxValue);
                    return [code, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity.toFixed(2)})`];
                })
            );

            const regionValues = Object.fromEntries(
                Object.entries(dataValues).map(([code]) => [code, code])
            );

            const options = {
                selector: selector,
                map: map,
                series: {
                    regions: [{
                        attribute: 'fill',
                        scale: regionScales,
                        values: regionValues,
                    }]
                },
                showTooltip: true,
                onRegionTooltipShow(event, tooltip, code) {
                    const stats = self.stats[code.toUpperCase()] || 0;
                    tooltip.text(
                        `<h5>${tooltip.text()}: ${stats} ${tooltipText}</h5>`,
                        true // Enable HTML in the tooltip
                    );
                }
            };

            const mergedOptions = {
                ...options,
                ...additionalOptions,
                series: {
                    regions: [
                        {
                            ...options.series.regions[0],
                            ...additionalOptions.series?.regions?.[0],
                        }
                    ],
                },
            };

            self.mapInstance = new jsVectorMap(mergedOptions);
        },
    };
}

// Register the Alpine component
document.addEventListener('alpine:init', () => {
    Alpine.data('initWorldMapWidget', initWorldMapWidget);
});
