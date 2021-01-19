import { css, customElement, html, LitElement, property, query } from "lit-element";
import _data from '../data.json';
import { barePinyin } from "./util";
import '@material/mwc-formfield';
import '@material/mwc-checkbox';
import '@material/mwc-snackbar'
import { Snackbar } from "@material/mwc-snackbar";

type Character = typeof _data[0] & {
  b: string|string[]; // bare pinyin
}
type BarePinyinsMap = {[pinyin: string]: Character[]};

const characters = _data as Character[];

@customElement('app-container')
export class AppContainer extends LitElement {
  @property({type: Object})
  barePinyinsMap: BarePinyinsMap = {};

  @property({type: Boolean})
  simplified = false;

  @query('mwc-snackbar') snackbar!: Snackbar;

  constructor() {
    super();
    this.constructBarePinyinsMap();
  }

  static styles = css`
  #pinyins-table {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }

  .p-group {
    margin-bottom: 20px;
  }
  .p-group > header {
    padding: 6px;
    background-color: #37474f;
    color: white;
  }
  .pinyins {
    padding: 7px;
  }
  .pinyins > span {
    cursor: pointer;
  }
  `

  render () {
    return html`
    <div dir="rtl">
      <mwc-formfield label="simplified chinese">
        <mwc-checkbox
          ?checked="${this.simplified}"
          @change="${(e) => this.simplified = e.target.checked}"></mwc-checkbox>
      </mwc-formfield>
    </div>

    <div id="pinyins-table">

      <div style="padding:12px;color:grey">
      ${Object.keys(this.barePinyinsMap).length} bare pinyins. Zoom in the page using CTRL + mouse scrolling.</div>

    ${Object.entries(this.barePinyinsMap).map(([pinyin, characters]) => {
      return html`
      <div class="p-group">
        <header>${pinyin} (${characters.length})</header>
        <div class="pinyins">
        ${characters.map(c => {
          return html`
          <span title="${c.p}"
            @click="${() => this.snackbar.labelText=`${c.t} ⇨ ${c.p}`}"
          >${this.simplified ? (c.s || c.t) : c.t}</span>
          `
        })}
        </div>
      </div>
      `
    })}
    </div>

    <mwc-snackbar
      timeoutMs="-1"
      labelText="click on a character" open></mwc-snackbar>
    `
  }

  getCharactersList (characters: Character[]) {
    // implement for simplified mode
    return characters;
  }

  constructBarePinyinsMap () {
    // we add a new property b (bare) to the characters list
    for (const character of characters) {
      character.b = barePinyin(character.p);
      if (character.b.indexOf('|')) {
        character.b = [...new Set(character.b.split('|'))]
        if (character.b.length === 1) {
          character.b = character.b[0];
        }
      }
    }

    // now we create the bare pinyins map
    const barePinyinsMap: BarePinyinsMap = {};
    for (const character of characters) {
      const pinyins = (character.b instanceof Array) ? character.b : [character.b];
      for (const pinyin of pinyins) {
        if (!(pinyin in barePinyinsMap)) {
          barePinyinsMap[pinyin] = [];
        }
        barePinyinsMap[pinyin].push(character);
      }
    }

    // let's order the pinyins by the number of characters
    this.barePinyinsMap = Object.fromEntries(
      Object.entries(barePinyinsMap).sort(function (a, b) {
        return b[1].length - a[1].length;
      })
    )
  }
}