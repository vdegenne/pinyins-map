import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { terser } from "rollup-plugin-terser";


export default {
  input: 'src/app-container.ts',
  output: {file: 'bundle.js', format: 'iife'},
  plugins: [json(), typescript(), resolve(), terser({format: {comments: false}})]
}