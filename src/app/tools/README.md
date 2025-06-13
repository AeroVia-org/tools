# Tool Development Requirements

When creating a new tool page, follow these guidelines:

1.  **Page Structure:**

    - Create a new route directory under `/tools`, e.g., `/tools/your-tool-name`.
    - The main component should be in `page.tsx` within this directory.

2.  **Core Functionality:**

    - Provide input fields for user interaction.
    - Include multiple calculation methods if applicable.

3.  **Interactive Elements:**

    - Interactive visual representations (graphs, diagrams, etc.) that is interactive
    - Hover effects with additional information, equations, animations, etc.

4.  **Content & Explanation:**

    - Clearly explain the underlying aerospace concept.
    - Display the relevant equations used in the calculations.
    - Extract the detailed theory/explanation into a separate `Theory.tsx` component.
    - Render the `<Theory />` component at the end of the main `page.tsx` component.

5.  **Styling:**

    - Ensure the new tool's appearance matches the styling of existing tools. Use existing UI components where possible.

6.  **Tools Overview Page:**
    - Add a new card for your tool in `src/app/(home)/tools/page.tsx`. Use an appropriate icon from `react-icons/fa`.
