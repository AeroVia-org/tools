"use client";

import { useState, useEffect, useCallback } from "react";
import { FaSatellite, FaPlus, FaTrash, FaEdit, FaChartPie } from "react-icons/fa";

import {
  calculateDeltaVBudget,
  createMissionPhase,
  getCommonDeltaVValues,
  MissionPhase,
  DeltaVBudgetResult,
} from "./logic";
import Theory from "./theory";
import Navigation from "../../components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Button } from "@packages/ui/components/ui/button";
import ToolTitle from "../../components/ToolTitle";
import OpenSourceCard from "../../components/OpenSourceCard";

// Helper to format numbers with appropriate precision
const formatNumber = (num: number, decimals: number = 1): string => {
  if (isNaN(num)) return "N/A";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export default function DeltaVBudgetToolPage() {
  // State for mission phases
  const [phases, setPhases] = useState<MissionPhase[]>([]);
  const [editingPhase, setEditingPhase] = useState<MissionPhase | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);

  // State for new phase form
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseDeltaV, setNewPhaseDeltaV] = useState("");
  const [newPhaseCategory, setNewPhaseCategory] = useState<MissionPhase["category"]>("launch");
  const [newPhaseDescription, setNewPhaseDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Results state
  const [results, setResults] = useState<DeltaVBudgetResult | null>(null);

  // Get common values for quick reference
  const commonValues = getCommonDeltaVValues();

  // Calculate budget when phases change
  useEffect(() => {
    const calculatedResults = calculateDeltaVBudget(phases);
    setResults(calculatedResults);
  }, [phases]);

  // Add a new phase
  const handleAddPhase = useCallback(() => {
    setFormError(null);

    if (!newPhaseName.trim() || !newPhaseDeltaV.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const deltaV = parseFloat(newPhaseDeltaV);
    if (isNaN(deltaV) || deltaV < 0 || deltaV > 100000) {
      setFormError("Delta-V must be between 0 and 100,000 m/s.");
      return;
    }

    // Check for duplicate names (excluding current editing phase)
    const isDuplicate = phases.some(
      (phase) => phase.name.toLowerCase() === newPhaseName.trim().toLowerCase() && phase.id !== editingPhase?.id,
    );

    if (isDuplicate) {
      setFormError("A phase with this name already exists.");
      return;
    }

    const newPhase = createMissionPhase(newPhaseName.trim(), deltaV, newPhaseCategory, newPhaseDescription.trim());
    setPhases((prev) => [...prev, newPhase]);

    // Reset form
    setNewPhaseName("");
    setNewPhaseDeltaV("");
    setNewPhaseCategory("launch");
    setNewPhaseDescription("");
    setIsAddingPhase(false);
  }, [newPhaseName, newPhaseDeltaV, newPhaseCategory, newPhaseDescription, phases, editingPhase]);

  // Add phase from common values
  const handleAddCommonPhase = useCallback((commonValue: (typeof commonValues)[0]) => {
    const newPhase = createMissionPhase(
      commonValue.name,
      commonValue.deltaV,
      commonValue.category,
      commonValue.description,
    );
    setPhases((prev) => [...prev, newPhase]);
  }, []);

  // Remove a phase
  const handleRemovePhase = useCallback((phaseId: string) => {
    setPhases((prev) => prev.filter((phase) => phase.id !== phaseId));
  }, []);

  // Toggle phase enabled state
  const handleTogglePhase = useCallback((phaseId: string) => {
    setPhases((prev) =>
      prev.map((phase) => (phase.id === phaseId ? { ...phase, isEnabled: !phase.isEnabled } : phase)),
    );
  }, []);

  // Start editing a phase
  const handleStartEdit = useCallback((phase: MissionPhase) => {
    setEditingPhase(phase);
    setNewPhaseName(phase.name);
    setNewPhaseDeltaV(phase.deltaV.toString());
    setNewPhaseCategory(phase.category);
    setNewPhaseDescription(phase.description || "");
  }, []);

  // Save edited phase
  const handleSaveEdit = useCallback(() => {
    setFormError(null);

    if (!editingPhase || !newPhaseName.trim() || !newPhaseDeltaV.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const deltaV = parseFloat(newPhaseDeltaV);
    if (isNaN(deltaV) || deltaV < 0 || deltaV > 100000) {
      setFormError("Delta-V must be between 0 and 100,000 m/s.");
      return;
    }

    // Check for duplicate names (excluding current editing phase)
    const isDuplicate = phases.some(
      (phase) => phase.name.toLowerCase() === newPhaseName.trim().toLowerCase() && phase.id !== editingPhase.id,
    );

    if (isDuplicate) {
      setFormError("A phase with this name already exists.");
      return;
    }

    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === editingPhase.id
          ? {
              ...phase,
              name: newPhaseName.trim(),
              deltaV,
              category: newPhaseCategory,
              description: newPhaseDescription.trim(),
            }
          : phase,
      ),
    );

    // Reset editing state
    setEditingPhase(null);
    setNewPhaseName("");
    setNewPhaseDeltaV("");
    setNewPhaseCategory("launch");
    setNewPhaseDescription("");
  }, [editingPhase, newPhaseName, newPhaseDeltaV, newPhaseCategory, newPhaseDescription, phases]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingPhase(null);
    setNewPhaseName("");
    setNewPhaseDeltaV("");
    setNewPhaseCategory("launch");
    setNewPhaseDescription("");
    setIsAddingPhase(false);
    setFormError(null);
  }, []);

  // Get category color
  const getCategoryColor = (category: MissionPhase["category"]): string => {
    switch (category) {
      case "launch":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "transfer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "orbital":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "landing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
      case "other":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <Navigation />

      {/* Title */}
      <ToolTitle toolKey="delta-v-budget-tool" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Mission Phases Panel */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">Mission Phases</h2>
            <Button
              onClick={() => setIsAddingPhase(true)}
              className="flex items-center gap-2"
              disabled={isAddingPhase || editingPhase !== null}
            >
              <FaPlus className="h-4 w-4" />
              Add Phase
            </Button>
          </div>

          {/* Add/Edit Phase Form */}
          {(isAddingPhase || editingPhase) && (
            <div className="border-border bg-muted/30 mb-6 rounded-lg border p-4">
              <h3 className="text-foreground mb-4 font-medium">{editingPhase ? "Edit Phase" : "Add New Phase"}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground block text-sm font-medium">Delta-V (m/s)</label>
                    <Input
                      type="number"
                      value={newPhaseDeltaV}
                      onChange={(e) => setNewPhaseDeltaV(e.target.value)}
                      placeholder="e.g., 9400"
                      min="0"
                      max="100000"
                      step="1"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-foreground block text-sm font-medium">Category</label>
                    <Select
                      value={newPhaseCategory}
                      onValueChange={(value) => setNewPhaseCategory(value as MissionPhase["category"])}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="launch">Launch</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="orbital">Orbital</SelectItem>
                        <SelectItem value="landing">Landing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label htmlFor="phase-name-input" className="text-foreground block text-sm font-medium">
                    Phase Name
                  </label>
                  <Input
                    value={newPhaseName}
                    onChange={(e) => setNewPhaseName(e.target.value)}
                    placeholder="e.g., Launch to LEO"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phase-description-input" className="text-foreground block text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Input
                    value={newPhaseDescription}
                    onChange={(e) => setNewPhaseDescription(e.target.value)}
                    placeholder="Brief description of this phase"
                    className="mt-1"
                  />
                </div>

                {formError && (
                  <div className="bg-destructive/10 rounded-md p-3">
                    <p className="text-destructive text-sm font-medium">
                      <span className="font-bold">Error:</span> {formError}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={editingPhase ? handleSaveEdit : handleAddPhase}>
                    {editingPhase ? "Save" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mission Phases List */}
          <div className="mb-6">
            <div className="space-y-3">
              {phases.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <FaSatellite className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <p className="text-lg font-medium">No mission phases added</p>
                  <p className="text-sm">Add phases to calculate your delta-v budget</p>
                </div>
              ) : (
                phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`border-border rounded-lg border p-4 ${!phase.isEnabled ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={phase.isEnabled}
                          onChange={() => handleTogglePhase(phase.id)}
                          className="border-border rounded"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium">{phase.name}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(phase.category)}`}
                            >
                              {phase.category}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {formatNumber(phase.deltaV)} m/s
                            {phase.description && ` • ${phase.description}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEdit(phase)}
                          disabled={isAddingPhase || editingPhase !== null}
                        >
                          <FaEdit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePhase(phase.id)}
                          disabled={isAddingPhase || editingPhase !== null}
                        >
                          <FaTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="mb-6">
            <h3 className="text-foreground mb-3 text-lg font-medium">Quick Reference</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {commonValues.slice(0, 8).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleAddCommonPhase(item)}
                  className="border-border bg-muted hover:bg-accent cursor-pointer rounded-md border p-3 text-left text-sm transition-colors"
                  disabled={isAddingPhase || editingPhase !== null}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs">{formatNumber(item.deltaV)} m/s</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Results Panel */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <h2 className="text-foreground mb-6 text-lg font-semibold">Delta-V Budget</h2>

          {results && phases.length > 0 ? (
            <div className="space-y-6">
              {/* Mission Complexity */}
              <div className="border-border bg-muted/50 flex flex-col items-center rounded-lg border p-6 text-center">
                <FaChartPie className="mb-2 h-10 w-10 text-blue-600" />
                <h3 className="text-foreground text-xl font-medium">Mission Complexity</h3>
                <div className={`mt-1 text-2xl font-bold ${results.complexityColor}`}>{results.missionComplexity}</div>
                <div className="text-muted-foreground mt-2 text-sm">{results.enabledPhases.length} enabled phases</div>
              </div>

              {/* Total Delta-V */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaSatellite className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                  <div>
                    <div className="text-foreground font-medium">Total Delta-V</div>
                    <div className="text-foreground text-lg font-semibold">
                      {formatNumber(results.enabledTotalDeltaV)} m/s
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatNumber(results.enabledTotalDeltaVKm, 2)} km/s
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-start gap-4 rounded-lg border p-4">
                  <FaChartPie className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                  <div>
                    <div className="text-foreground font-medium">All Phases</div>
                    <div className="text-foreground text-lg font-semibold">{formatNumber(results.totalDeltaV)} m/s</div>
                    <div className="text-muted-foreground text-sm">{formatNumber(results.totalDeltaVKm, 2)} km/s</div>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="border-border bg-muted/30 rounded-lg border p-4">
                <h3 className="text-foreground mb-3 text-lg font-medium">Budget Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(results.budgetBreakdown).map(([category, deltaV]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${
                            category === "launch"
                              ? "bg-red-500"
                              : category === "transfer"
                                ? "bg-blue-500"
                                : category === "orbital"
                                  ? "bg-green-500"
                                  : category === "landing"
                                    ? "bg-orange-500"
                                    : "bg-purple-500"
                          }`}
                        ></span>
                        <span className="text-foreground capitalize">{category}</span>
                      </div>
                      <span className="text-foreground font-medium">{formatNumber(deltaV)} m/s</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="border-border bg-muted/30 rounded-lg border p-4">
                <h3 className="text-foreground mb-3 text-lg font-medium">Recommendations</h3>
                <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              <div className="text-center">
                <FaChartPie className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <p className="text-lg font-medium">No mission phases</p>
                <p className="text-sm">Add phases to see your delta-v budget</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theory Section */}
      <Theory />

      {/* Open Source Card */}
      <OpenSourceCard />
    </div>
  );
}
