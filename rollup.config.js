import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";
export default {
    input: 'src/index.ts',
    output: {
        name: 'idmeshVue',
        file: 'dist/sdk.js',
        format: 'umd',
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
        })
    ],
};
