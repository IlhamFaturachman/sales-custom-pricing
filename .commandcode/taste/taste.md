# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
- Execute work plans directly rather than creating plan documents without execution. Confidence: 0.65
- Before making changes, do a thorough component-by-component comparison/analysis and discuss findings with user first rather than jumping to implementation. Confidence: 0.70

# css
- Use scoped CSS with unique class prefixes (e.g., `dash-*`) to prevent layout styles from leaking between pages. Confidence: 0.80
- Use `<style is:global>` only when styles must apply globally, and always use prefixed class names to avoid conflicts. Confidence: 0.75

# pricing-page
- Generated pricing page must match the original template exactly (same layout, same plan card width, same plan structure per combo). Confidence: 0.80
- Duration labels should be dynamic and fully editable by sales admin, not restricted to fixed values. Confidence: 0.75
- Support multiple pricing plans per (category × duration) combination (e.g., Pro, Business, Enterprise tiers). Confidence: 0.70
