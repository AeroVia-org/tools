"use client";

const RedshiftVisualization = ({ redshift }: { redshift: number | null }) => {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {redshift !== null && (
        <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">z = {redshift}</h3>
      )}
      <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
        {redshift === null ? (
          <p>Enter values to see the result.</p>
        ) : (
          <>
            {redshift < 0 && (
              <p>
                You will observe a <span className="text-blue-500">blueshift</span>.
              </p>
            )}
            {redshift > 0 && (
              <p>
                You will observe a <span className="text-red-500">redshift</span>.
              </p>
            )}
            {redshift === 0 && <p>You will not observe any shift.</p>}
          </>
        )}
      </p>
    </div>
  );
};

export default RedshiftVisualization;
