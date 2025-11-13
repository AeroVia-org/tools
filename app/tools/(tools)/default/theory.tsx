export default function DefaultCalculatorTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <h3 className="text-foreground mb-4 text-lg font-semibold">About This Calculator</h3>
      <div className="text-muted-foreground space-y-3 text-sm">
        <p>
          This is a simple calculator template that adds 1 to any number you enter.
        </p>
        <p>
          The calculation is performed using the formula: <strong>result = input + 1</strong>
        </p>
        <p>
          This template can be customized to implement more complex calculations as needed.
        </p>
      </div>
    </div>
  );
}
