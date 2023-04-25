import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";
import replace from '@rollup/plugin-replace';
import pkg from './package.json' assert { type: 'json' };

const getConfig = (file, format) => ({
    input: 'src/index.ts',
    output: {
        name: 'idmeshVue',
        file,
        format,
        sourcemap: true,
        globals: {
            vue: 'Vue',
            'idmesh-spa-js': 'idmesh',
            'vue-router': 'VueRouter'
        }
    },
    external: ['vue', 'vue-router', 'idmesh-spa-js'],
    plugins: [
        typescript({
            allowSyntheticDefaultImports: true,
            clean: true,
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                noEmit: false,
                sourceMap: true,
                compilerOptions: {
                    lib: ['dom', 'es6']
                }
            }
        }),
        nodeResolve({}),
        commonjs(),
        terser({
            format: {
                comments: false,
            }
        }),
        replace({ __VERSION__: `'${pkg.version}'`, preventAssignment: true })
    ],
});

export default [
    getConfig('dist/sdk.js', 'umd'),
    getConfig(pkg.main, 'cjs'),
    getConfig(pkg.module, 'esm'),
];
