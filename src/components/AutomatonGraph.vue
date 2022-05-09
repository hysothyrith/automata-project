<script setup lang="ts">
import cytoscape from "cytoscape";
import { onMounted, ref } from "vue";
import { Automaton } from "../lib/automaton.interface";
import { createEdge, createNode } from "../utils/graph.utils";
import { debounce } from "../utils/performance.utils";

interface Props {
  automaton: Automaton;
  height: number | string;
  width?: number | string;
}

const {
  automaton: { finalStates, startState, states },
  width = "100%",
} = defineProps<Props>();

const container = ref(null);

const NODE_COLOR = "gray";
const NODE_SIZE = 50;
const EDGE_COLOR = "lightgray";

const stateNames = Object.keys(states);
const graphNodes = stateNames.map(createNode);

// The key is in the format `from/to` and the value is the symbols that triggers
// the transition
const edges: Map<string, string[]> = new Map();
for (const state of stateNames) {
  for (const transition of Object.values(states[state])) {
    for (const [symbol, resultingStates] of Object.entries(transition)) {
      for (const resultingState of Array.isArray(resultingStates)
        ? resultingStates
        : [resultingStates]) {
        const key = `${state}/${resultingState}`;
        if (!edges.has(key)) {
          edges.set(key, []);
        }
        edges.get(key).push(symbol || "ε");
      }
    }
  }
}

const graphEdges: ReturnType<typeof createEdge>[] = [];
for (const [key, symbols] of edges) {
  const [from, to] = key.split("/");
  graphEdges.push(createEdge({ from, to, label: symbols.join(", ") }));
}

onMounted(() => {
  const cy = cytoscape({
    container: container.value,
    elements: [
      createNode("__ghost__"),
      ...graphNodes,
      ...graphEdges,
      createEdge({ from: "__ghost__", to: startState }),
    ],
    style: [
      {
        selector: "node",
        style: {
          "background-opacity": 0,
          "border-color": NODE_COLOR,
          "border-width": 2,
          label: "data(id)",
          "text-valign": "center",
          "text-halign": "center",
          width: NODE_SIZE,
          height: NODE_SIZE,
        },
      },
      {
        selector: finalStates.map((state) => `node[id="${state}"]`).join(", "),
        style: {
          "border-color": "black",
          "border-width": "4px",
        },
      },
      {
        selector: "edge",
        style: {
          width: 2,
          label: "data(label)",
          "line-color": EDGE_COLOR,
          "target-arrow-color": EDGE_COLOR,
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          "text-margin-y": -20,
          "control-point-step-size": 72,
        },
      },
      {
        selector: 'node[id="__ghost__"]',
        style: {
          opacity: 0,
          width: 1,
          height: 1,
        },
      },
    ],
    layout: {
      name: "grid",
    },
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      cy.fit();
    }, 100)
  );
});
</script>

<template>
  <div ref="container" class="container"></div>
</template>

<style>
.container {
  height: v-bind("height");
  width: v-bind("width");
}
</style>
