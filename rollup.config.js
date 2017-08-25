import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { main, module } from './package.json';

export default {
    name: 'PowerBIResponsive',
    input: module,
    output: {
        file: main,
        format: 'iife',
    },
    sourcemap: true,
    plugins: [
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'powerbi-client': [
                    'service',
                    'factories',
                    'models'
                ],
                'tsmonad': [
                    'Maybe',
                    'Either',
                    'Monad',
                    'Writer'
                ]
            }
        }),
        resolve(),
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: ['es2015-rollup'],
            plugins: ['external-helpers']
        })
    ]
}
