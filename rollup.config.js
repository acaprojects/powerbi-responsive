import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const name = 'powerbi-responsive';

export default {
    entry: './src/main.ts',
    format: 'iife',
    moduleName: 'PowerBIResponsive',
    dest: `./dist/${name}.js`,
    sourceMap: true,
    plugins: [
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'powerbi-client': [
                    'service',
                    'factories',
                    'models'
                ]
            }
        }),
        typescript(),
        resolve(),
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: ['es2015-rollup'],
            plugins: ['external-helpers']
        })
    ]
}
