export default function DefaultCalculatorTheory() {
  return (
    <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
      <h3 className="text-foreground mb-4 text-lg font-semibold">About Redshift</h3>
      <div className="text-muted-foreground space-y-3 text-sm">
        <p>
          The redshift formula is{" "}
          <span className="font-mono">
            z = (λ<sub>observed</sub> - λ<sub>rest</sub>) / λ<sub>rest</sub>
          </span>
          .
        </p>
        <p>
          This effect is caused by the expansion of the universe. As time passes, objects move away from each other,
          causing the wavelength of light to increase, similarly to how the pitch of a sound increases as the source
          moves away from the observer (Doppler effect).
        </p>
        <p>A value of z = 0 means that the object is not moving relative to the observer.</p>
        <p>
          A value of z &lt; 0 means that the object is moving towards the observer. This is called a{" "}
          <span className="text-blue-500">blueshift</span>.
        </p>
        <p>
          A value of z &gt; 0 means that the object is moving away from the observer. This is called a{" "}
          <span className="text-red-500">redshift</span>.
        </p>
      </div>
    </div>
  );
}
