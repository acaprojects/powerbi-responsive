import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: './src/main.ts',
    format: 'iife',
    moduleName: 'PowerBIResponsive',
    dest: './dist/powerbi-responsive.js',
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
        resolve()
    ]
}
