export interface Token {
    type: string;
    value: string;
}

const keywords = [
    'const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
    'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue', 'class', 'extends', 'import',
    'export', 'from', 'as', 'async', 'await', 'yield', 'new', 'this', 'super', 'static', 'public',
    'private', 'protected', 'abstract', 'interface', 'type', 'enum', 'namespace', 'module', 'declare',
    'implements', 'extends', 'keyof', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void', 'undefined',
    'null', 'true', 'false', 'boolean', 'string', 'number', 'object', 'any', 'unknown', 'never',
    'def', 'lambda', 'with', 'pass', 'elif', 'and', 'or', 'not', 'is', 'None', 'True', 'False',
    'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'tuple', 'set'
];

const operators = [
    '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=',
    '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '?', ':', '=>',
    '+=', '-=', '*=', '/=', '%=', '++', '--', '...', '?.', '??', '??='
];

export function tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < code.length) {
        const char = code[i];

        // Skip whitespace but preserve it
        if (/\s/.test(char)) {
            let whitespace = '';
            while (i < code.length && /\s/.test(code[i])) {
                whitespace += code[i];
                i++;
            }
            tokens.push({ type: 'whitespace', value: whitespace });
            continue;
        }

        // Comments
        if (char === '/' && i + 1 < code.length) {
            if (code[i + 1] === '/') {
                // Single line comment
                let comment = '';
                while (i < code.length && code[i] !== '\n') {
                    comment += code[i];
                    i++;
                }
                tokens.push({ type: 'comment', value: comment });
                continue;
            } else if (code[i + 1] === '*') {
                // Multi-line comment
                let comment = '';
                comment += code[i++];
                comment += code[i++];
                while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) {
                    comment += code[i];
                    i++;
                }
                if (i < code.length - 1) {
                    comment += code[i++];
                    comment += code[i++];
                }
                tokens.push({ type: 'comment', value: comment });
                continue;
            }
        }

        // Python comments
        if (char === '#') {
            let comment = '';
            while (i < code.length && code[i] !== '\n') {
                comment += code[i];
                i++;
            }
            tokens.push({ type: 'comment', value: comment });
            continue;
        }

        // Strings
        if (char === '"' || char === "'" || char === '`') {
            const quote = char;
            let string = char;
            i++;

            if (quote === '`') {
                // Template literal
                while (i < code.length) {
                    if (code[i] === '`') {
                        string += code[i];
                        i++;
                        break;
                    } else if (code[i] === '$' && i + 1 < code.length && code[i + 1] === '{') {
                        // Template expression
                        string += code[i++];
                        string += code[i++];
                        let braceCount = 1;
                        const exprStart = string.length;

                        while (i < code.length && braceCount > 0) {
                            if (code[i] === '{') braceCount++;
                            else if (code[i] === '}') braceCount--;
                            string += code[i];
                            i++;
                        }

                        // Mark the expression part
                        const expr = string.slice(exprStart, -1);
                        tokens.push({ type: 'template-literal', value: string.slice(0, exprStart) });
                        tokens.push({ type: 'template-expression', value: expr });
                        string = '}';
                    } else if (code[i] === '\\' && i + 1 < code.length) {
                        string += code[i++];
                        string += code[i++];
                    } else {
                        string += code[i];
                        i++;
                    }
                }
                tokens.push({ type: 'template-literal', value: string });
            } else {
                // Regular string
                while (i < code.length) {
                    if (code[i] === quote) {
                        string += code[i];
                        i++;
                        break;
                    } else if (code[i] === '\\' && i + 1 < code.length) {
                        string += code[i++];
                        string += code[i++];
                    } else {
                        string += code[i];
                        i++;
                    }
                }
                tokens.push({ type: 'string', value: string });
            }
            continue;
        }

        // Numbers
        if (/\d/.test(char) || (char === '.' && i + 1 < code.length && /\d/.test(code[i + 1]))) {
            let number = '';
            while (i < code.length && (/[\d._]/.test(code[i]) ||
                (code[i].toLowerCase() === 'e' && i + 1 < code.length && (/[+-\d]/.test(code[i + 1]))))) {
                number += code[i];
                i++;
            }
            tokens.push({ type: 'number', value: number });
            continue;
        }

        // Operators
        let foundOperator = false;
        for (const op of operators.sort((a, b) => b.length - a.length)) {
            if (code.substr(i, op.length) === op) {
                tokens.push({ type: 'operator', value: op });
                i += op.length;
                foundOperator = true;
                break;
            }
        }
        if (foundOperator) continue;

        // Identifiers and keywords
        if (/[a-zA-Z_$]/.test(char)) {
            let identifier = '';
            while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
                identifier += code[i];
                i++;
            }

            // Check if it's a function call
            let j = i;
            while (j < code.length && /\s/.test(code[j])) j++;
            const isFunction = j < code.length && code[j] === '(';

            if (keywords.includes(identifier)) {
                tokens.push({ type: 'keyword', value: identifier });
            } else if (isFunction) {
                tokens.push({ type: 'function', value: identifier });
            } else {
                tokens.push({ type: 'identifier', value: identifier });
            }
            continue;
        }

        // Everything else
        tokens.push({ type: 'other', value: char });
        i++;
    }

    return tokens;
}

export function highlightCode(code: string): string {
    const tokens = tokenize(code);

    return tokens.map(token => {
        switch (token.type) {
            case 'keyword':
                return `<span class="token-keyword">${escapeHtml(token.value)}</span>`;
            case 'function':
                return `<span class="token-function">${escapeHtml(token.value)}</span>`;
            case 'string':
                return `<span class="token-string">${escapeHtml(token.value)}</span>`;
            case 'template-literal':
                return `<span class="token-template-literal">${escapeHtml(token.value)}</span>`;
            case 'template-expression':
                return `<span class="token-template-expression">${escapeHtml(token.value)}</span>`;
            case 'number':
                return `<span class="token-number">${escapeHtml(token.value)}</span>`;
            case 'comment':
                return `<span class="token-comment">${escapeHtml(token.value)}</span>`;
            case 'operator':
                return `<span class="token-operator">${escapeHtml(token.value)}</span>`;
            default:
                return escapeHtml(token.value);
        }
    }).join('');
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
