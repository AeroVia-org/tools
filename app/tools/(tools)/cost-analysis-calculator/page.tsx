"use client";

// TODO: Implement Cost Analysis Calculator
// This tool provides economic analysis for aerospace projects including cost vs quantity calculations

// CORE FUNCTIONALITY TO IMPLEMENT:
// 1. Cost vs Quantity Analysis:
//    - Unit cost calculations (cost per unit)
//    - Volume discounts and economies of scale
//    - Break-even analysis
//    - Cost per unit vs quantity curves
//    - Learning curve effects (cost reduction over time)

// 2. Tool Cost Analysis:
//    - Tooling cost amortization
//    - Cost per part vs tool life
//    - Tool cost vs production volume
//    - Tooling ROI calculations
//    - Tool maintenance and replacement costs

// 3. Production Economics:
//    - Fixed vs variable costs
//    - Manufacturing cost breakdown
//    - Labor cost analysis
//    - Material cost optimization
//    - Overhead allocation

// 4. Aerospace-Specific Cost Models:
//    - Development vs production costs
//    - Certification costs
//    - Testing and validation costs
//    - Supply chain cost analysis
//    - Lifecycle cost analysis

// INPUT PARAMETERS TO INCLUDE:
// - Production quantities
// - Unit costs (material, labor, overhead)
// - Tooling costs and tool life
// - Fixed costs (development, certification)
// - Variable costs (materials, labor)
// - Learning curve factors
// - Volume discount rates

// CALCULATION METHODS TO IMPLEMENT:
// 1. Unit Cost Calculations:
//    - Unit cost = (Fixed costs + Variable costs × Quantity) / Quantity
//    - Learning curve: Cost(n) = Cost(1) × n^(-learning_rate)
//    - Volume discounts: Cost = Base_cost × (1 - discount_rate × volume_tier)

// 2. Tool Cost Analysis:
//    - Cost per part = Tool_cost / Tool_life
//    - Tool ROI = (Savings_per_part × Production_volume) - Tool_cost
//    - Break-even quantity = Tool_cost / (Savings_per_part)

// 3. Break-Even Analysis:
//    - Break-even quantity = Fixed_costs / (Price_per_unit - Variable_cost_per_unit)
//    - Break-even time = Break-even_quantity / Production_rate

// 4. Economic Analysis:
//    - Total cost = Fixed_costs + (Variable_costs × Quantity)
//    - Average cost = Total_cost / Quantity
//    - Marginal cost = Change_in_total_cost / Change_in_quantity

// EDUCATIONAL CONTENT TO INCLUDE:
// - Cost structure fundamentals
// - Economies of scale principles
// - Learning curve theory
// - Tooling economics
// - Break-even analysis
// - Aerospace cost drivers
// - Cost optimization strategies

// VISUALIZATION FEATURES:
// - Cost vs quantity curves
// - Break-even charts
// - Tool cost amortization graphs
// - Learning curve plots
// - Cost breakdown pie charts
// - ROI analysis charts

// EXAMPLE CALCULATIONS TO SUPPORT:
// - Aircraft component manufacturing
// - Satellite production economics
// - Rocket engine cost analysis
// - UAV manufacturing costs
// - Aerospace tooling investments

// INTEGRATION POINTS:
// - Unit Converter (currency conversions)
// - Scientific Calculator (complex calculations)
// - Future: Project Management tools
// - Future: Supply Chain Analysis
// - Future: Risk Assessment tools

// VALIDATION DATA:
// - Aerospace industry cost data
// - Manufacturing cost models
// - Tooling cost databases
// - Economic analysis methods
// - Industry benchmarks

// TODO: Create logic.ts with cost calculation functions
// TODO: Create Theory.tsx with comprehensive educational content
// TODO: Implement interactive cost visualization
// TODO: Add aerospace cost database
// TODO: Include currency conversion
// TODO: Add export functionality for cost reports
// TODO: Implement sensitivity analysis
// TODO: Add scenario comparison tools

import { FaCalculator, FaChartLine, FaDollarSign } from "react-icons/fa";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

export default function CostAnalysisCalculatorPage() {
  return (
    <div className="mx-auto py-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">

      {/* Title */}
      <ToolTitle toolKey="cost-analysis-calculator" />

      <div className="py-16 text-center">
        <FaDollarSign className="text-muted-foreground mx-auto mb-6 text-6xl" />
        <h2 className="text-foreground mb-4 text-2xl font-bold">Cost Analysis Calculator</h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
          Calculate costs vs quantities, tool costs vs production amounts, and economic analysis
          for aerospace projects with break-even analysis and learning curves.
        </p>

        <div className="border-border bg-card mx-auto max-w-4xl rounded-lg border p-6 text-left shadow-lg">
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaCalculator className="text-primary" />
            Planned Features
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-foreground mb-3 font-semibold">Cost vs Quantity Analysis</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Unit cost calculations</li>
                <li>• Volume discounts and economies of scale</li>
                <li>• Break-even analysis</li>
                <li>• Learning curve effects</li>
                <li>• Cost per unit vs quantity curves</li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Tool Cost Analysis</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Tooling cost amortization</li>
                <li>• Cost per part vs tool life</li>
                <li>• Tool cost vs production volume</li>
                <li>• Tooling ROI calculations</li>
                <li>• Tool maintenance costs</li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Production Economics</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Fixed vs variable costs</li>
                <li>• Manufacturing cost breakdown</li>
                <li>• Labor cost analysis</li>
                <li>• Material cost optimization</li>
                <li>• Overhead allocation</li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Aerospace Cost Models</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Development vs production costs</li>
                <li>• Certification costs</li>
                <li>• Testing and validation costs</li>
                <li>• Supply chain cost analysis</li>
                <li>• Lifecycle cost analysis</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-border bg-card mx-auto mt-6 max-w-4xl rounded-lg border p-6 text-left shadow-lg">
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaChartLine className="text-secondary" />
            Key Economic Concepts
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-foreground mb-3 font-semibold">Cost Structure Analysis</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Fixed costs (development, tooling)</li>
                <li>• Variable costs (materials, labor)</li>
                <li>• Semi-variable costs (utilities)</li>
                <li>• Direct vs indirect costs</li>
                <li>• Cost allocation methods</li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-3 font-semibold">Economic Principles</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Economies of scale</li>
                <li>• Learning curve theory</li>
                <li>• Volume discount models</li>
                <li>• Break-even analysis</li>
                <li>• ROI and payback period</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-border bg-card mx-auto mt-6 max-w-4xl rounded-lg border p-6 text-left shadow-lg">
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
            <FaDollarSign className="text-primary" />
            Aerospace Cost Examples
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold">Component</th>
                  <th className="text-right py-2 font-semibold">Development Cost</th>
                  <th className="text-right py-2 font-semibold">Unit Cost (1-10)</th>
                  <th className="text-right py-2 font-semibold">Unit Cost (100+)</th>
                  <th className="text-right py-2 font-semibold">Learning Curve</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-2">Aircraft Wing</td>
                  <td className="text-right py-2">$50M</td>
                  <td className="text-right py-2">$2.5M</td>
                  <td className="text-right py-2">$800K</td>
                  <td className="text-right py-2">85%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2">Satellite Bus</td>
                  <td className="text-right py-2">$100M</td>
                  <td className="text-right py-2">$15M</td>
                  <td className="text-right py-2">$8M</td>
                  <td className="text-right py-2">90%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2">Rocket Engine</td>
                  <td className="text-right py-2">$200M</td>
                  <td className="text-right py-2">$5M</td>
                  <td className="text-right py-2">$2M</td>
                  <td className="text-right py-2">80%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2">UAV Airframe</td>
                  <td className="text-right py-2">$10M</td>
                  <td className="text-right py-2">$500K</td>
                  <td className="text-right py-2">$150K</td>
                  <td className="text-right py-2">88%</td>
                </tr>
                <tr>
                  <td className="py-2">Landing Gear</td>
                  <td className="text-right py-2">$25M</td>
                  <td className="text-right py-2">$1.2M</td>
                  <td className="text-right py-2">$400K</td>
                  <td className="text-right py-2">85%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 text-sm">
          <p>This tool provides comprehensive cost analysis capabilities</p>
          <p>for aerospace engineers, project managers, and business analysts.</p>
        </div>
      </div>

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
