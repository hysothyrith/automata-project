<script setup lang="ts">
import { create, minimize } from "./lib/automaton";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref, watch, computed, reactive } from "vue";
import Card from "primevue/card";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Fieldset from "primevue/fieldset";
import MultiSelect from "primevue/multiselect";
import CascadeSelect from "primevue/cascadeselect";
import Dropdown from "primevue/dropdown";
import SplitButton from "primevue/splitbutton";
import { dfa2 } from "./lib/example-automata";

const text = ref("");
const dfa3 = create(dfa2);
let numberStates = ref(null);
let startState = ref(null);
let finalStates = ref(Array());
let symbols = ref(Array(""));
let times = ref(Array());
let amountOfStates = ref(Array());
let showGenerate = ref(false);
let menu = [
  {
    label: "Test if a FA is deterministic or non-deterministic",
    command: () => {},
  },
  {
    label: "Construct an equivalent DFA from an NFA",
    command: () => {},
  },
  {
    label: "Minimize a DFA",
    command: () => {},
  },
];

let dfa = ref({
  symbols: [],
  startState: "",
  finalStates: [],
  states: {},
});

watch(numberStates, (currentValue, oldValue) => {
  amountOfStates.value = [];
  for (let i = 0; i < currentValue.valueOf(); i++) {
    amountOfStates.value.push("q" + i);
  }
});
function addSymbol() {
  symbols.value.push("");
}
function generateOutput() {
  dfa.value.symbols = symbols.value;
  dfa.value.finalStates = finalStates.value;
  dfa.value.startState = startState.value;
  amountOfStates.value.forEach((element) => {
    dfa.value.states[element] = {
      on: {},
    };
    symbols.value.forEach((symbol) => {
      dfa.value.states[element]["on"][symbol] = [];
    });
    dfa.value.states[element]["on"]["ε"] = [];
  });
  showGenerate.value = true;
}
function designFa() {
  minimize(dfa3);
}
</script>

<template>
  <div>
    <Fieldset legend="Automation">
      <Splitter>
        <SplitterPanel>
          <div class="container p-5">
            <div class="mt-3">
              <h5>Number of States</h5>
              <InputText
                id="number_states"
                type="number"
                class="form-control"
                placeholder="Number States"
                v-model="numberStates"
              />
            </div>
            <div class="mt-3 form-group">
              <h5>Start State</h5>
              <Dropdown
                v-model="startState"
                :options="amountOfStates"
                style="width: 100%"
                placeholder="Select State"
              />
            </div>
            <div class="mt-3">
              <h5>Final State</h5>
              <MultiSelect
                style="width: 100%"
                :showToggleAll="false"
                :options="amountOfStates"
                v-model="finalStates"
                placeholder="Select State"
                display="chip"
              />
            </div>
            <div class="mt-3">
              <h5>Symbols</h5>
              <div class="mb-2" v-for="(symbol, index) in symbols" :key="index">
                <InputText
                  type="text"
                  class="form-control"
                  placeholder="Symbol"
                  v-model="symbols[index]"
                />
              </div>
              <button class="btn mt-2 btn-primary" @click="addSymbol">
                Add new Symbol
              </button>
            </div>
            <div class="mt-5 row">
              <button class="btn btn-success" @click="generateOutput">
                Generate
              </button>
            </div>
            <div class="mt-5">
              <div class="row">
                <div class="col-8">
                  <InputText
                    id="number_states"
                    type="text"
                    class="form-control"
                    placeholder="Symbol"
                  />
                </div>
                <button class="btn btn-success col-4">Test</button>
              </div>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel>
          <div class="p-5" v-if="showGenerate">
            <table class="table table-bordered">
              <thead class="text-center">
                <tr>
                  <th></th>
                  <th v-for="(symbol, index) in symbols" :key="index">
                    {{ symbol }}
                  </th>
                  <th>ε</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(state, key) in dfa.states" :key="key">
                  <td>{{ key }}</td>
                  <td v-for="(symbol, index) in state.on" :key="index">
                    <MultiSelect
                      :options="amountOfStates"
                      v-model="state.on[index]"
                      placeholder="Select State"
                      style="width: 100%"
                      :showToggleAll="false"
                      display="chip"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="form-group">
              <SplitButton
                label="Design FA"
                @click="designFa"
                :model="menu"
              ></SplitButton>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    </Fieldset>
  </div>
</template>