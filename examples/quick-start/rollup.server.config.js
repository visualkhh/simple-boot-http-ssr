import json from "@rollup/plugin-json";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
// import html from "@rollup/plugin-html";
// import typescript from 'rollup-plugin-typescript2';
import html  from 'rollup-plugin-html';
import nodeResolve from "@rollup/plugin-node-resolve";
import del from "rollup-plugin-delete";
import css from "rollup-plugin-import-css";
import copy from "rollup-plugin-copy";
// import html from "rollup-plugin-html";

export default {
    input: 'server/index.ts',
    output: {
        sourcemap: true,
        dir: 'dist-server',
        entryFileNames: 'bundle.js',
        format: 'cjs'
    },
    plugins: [
        css(),
        html({
            include: "**/*.html",
        }),
        json(),
        copy({
            targets: [
                // {src: 'ormconfig.json', dest: 'dist-server'},
                // {src: 'server', dest: 'dist-server'},
            ]
        }),
        typescript({tsconfig: 'tsconfig.server.json'}),
        del({ targets: ['dist-server/*'] })
        // commonjs(),
        // typescript({ tsconfig: './tsconfig.json', clean: true })
    ]
};
