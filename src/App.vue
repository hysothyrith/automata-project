<script setup lang="ts">
import {
  create,
  minimize,
  checkFinteAutomaton,
  cleanData,
  determinize,
  testString,
} from "./lib/automaton";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref, watch, computed, reactive, defineComponent } from "vue";
import Card from "primevue/card";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Fieldset from "primevue/fieldset";
import MultiSelect from "primevue/multiselect";
import CascadeSelect from "primevue/cascadeselect";
import Dropdown from "primevue/dropdown";
import SplitButton from "primevue/splitbutton";
import Dialog from "primevue/dialog";
import AutomatonGraphVue from "./components/AutomatonGraph.vue";
import Toast from "primevue/toast";
import Message from "primevue/message";
import Divider from "primevue/divider";
import FileUpload from "primevue/fileupload";
import { useToast } from "primevue/usetoast";
import { dfa2 } from "./lib/example-automata";
import { saveFile, openFile } from "./lib/FileWriter";

const text = ref("");
const dfa3 = create(dfa2);
let numberStates = ref(null);
let startState = ref(null);
let finalStates = ref(Array());
let symbols = ref(Array(""));
let times = ref(Array());
let amountOfStates = ref(Array());
let showGenerate = ref(false);
let displayBasic = ref(false);
const toast = useToast();
let severity = ref("success");
let symbols_input = ref("");

let menu = [
  {
    label: "Test if a FA is deterministic or non-deterministic",
    command: () => {
      severity.value = "success";
      text.value = checkFinteAutomaton(cleanData(dfa.value));
    },
  },
  {
    label: "Convert NFA to DFA",
    command: () => {
      automaton.value = cleanData(dfa.value);
      automaton.value = determinize(automaton.value);
      displayBasic.value = true;
    },
  },
  {
    label: "Minimize a DFA",
    command: () => {
      automaton.value = cleanData(dfa.value);
      automaton.value = minimize(automaton.value);
      displayBasic.value = true;
    },
  },
];
let dfa = ref({
  symbols: [],
  startState: "",
  finalStates: [],
  states: {},
});
let automaton = ref();
watch(numberStates, (currentValue, oldValue) => {
  amountOfStates.value = [];
  for (let i = 0; i < currentValue.valueOf(); i++) {
    amountOfStates.value.push("q" + i);
  }
});

function testSymbols(dfa, symbols_input) {
  if (testString(dfa, symbols_input)) {
    severity.value = "success";
    text.value = "Accepted";
  } else {
    severity.value = "error";
    text.value = "Rejected";
  }
}

function loadFile()
{
  const dfaFromFile = openFile();
  console.log('dfa from file' + dfaFromFile)
  //  dfa.value.symbols = dfaFromFile.sym;
  // dfa.value.finalStates = finalStates.value;
  // dfa.value.startState = startState.value;
  // amountOfStates.value.forEach((element) => {
  //   dfa.value.states[element] = {
  //     on: {},
  //   };
  //   symbols.value.forEach((symbol) => {
  //     dfa.value.states[element]["on"][symbol] = [];
  //   });
  //   dfa.value.states[element]["on"][""] = [];
  // });
  // showGenerate.value = true;
}

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
    dfa.value.states[element]["on"][""] = [];
  });
  showGenerate.value = true;
}
function designFa() {
  text.value = "";
  automaton.value = create(dfa.value);
  displayBasic.value = true;
}
function closeBasic() {
  displayBasic.value = false;
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
                    v-model="symbols_input"
                    class="form-control"
                    placeholder="Symbol"
                  />
                </div>
                <button
                  class="btn btn-success col-4"
                  :disabled="dfa.symbols.length == 0"
                  @click="testSymbols(dfa, symbols_input)"
                >
                  Test
                </button>
              </div>
            </div>

            <div class="mt-5">
              <hr />
              <div class="row">
                <h5>File</h5>
                <div class="col-8">
                  <InputText
                    type="text"
                    v-model="filename"
                    class="form-control"
                    placeholder="save file"
                  />
                </div>
                <button
                  class="btn btn-success col-4"
                  @click="saveFile(filename, dfa)"
                >
                  Save
                </button>
              </div>
            </div>
            <div class="mt-5">
              <div class="row">
                <div class="col-9">
                  <!-- <label for="fileToLoad" class="form-label"
                    >Open Automaton from local machince</label
                  > -->
                  <input class="form-control" type="file" id="fileToLoad" />
                      
                </div>
                 <button class="btn btn-success col-3" @click="loadFile">
                  Open
                </button>
                  
              
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

            <Message
              v-if="text"
              :life="5000"
              :severity="severity"
              :closable="false"
              >{{ text }}</Message
            >
          </div>
        </SplitterPanel>
      </Splitter>
      <Dialog
        header="Graph"
        v-model:visible="displayBasic"
        :style="{ width: '50vw' }"
      >
        <AutomatonGraphVue
          :automaton="automaton"
          :height="'500px'"
          :width="'100%'"
        />

        <template #footer>
          <Button
            label="Close"
            icon="pi pi-check"
            @click="closeBasic"
            autofocus
          />
        </template>
      </Dialog>
    </Fieldset>
  </div>
</template>
