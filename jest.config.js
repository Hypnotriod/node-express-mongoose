module.exports = {
    testEnvironment: "node",
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ],
    roots: ['<rootDir>/test'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
