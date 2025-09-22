/**
 * Custom ESLint plugin to detect i18n indirection patterns
 */

module.exports = {
  rules: {
    'no-i18n-indirection': {
      create(context) {
        return {
          CallExpression(node) {
            /** Check if this is an i18n.t() call */
            if (
              node.callee &&
              node.callee.type === 'MemberExpression' &&
              node.callee.property &&
              node.callee.property.name === 't' &&
              node.arguments &&
              node.arguments.length > 0
            ) {
              const firstArg = node.arguments[0];
              
              /** Check for problematic patterns */
              if (firstArg.type === 'Identifier') {
                /** i18n.t(variable, ...) */
                context.report({
                  node: firstArg,
                  message: 'Avoid i18n indirection: Use literal strings instead of variables in i18n.t() calls. Example: i18n.t("literal.id", values, "namespace")',
                });
              } else if (firstArg.type === 'MemberExpression') {
                /** i18n.t(object.property, ...) */
                context.report({
                  node: firstArg,
                  message: 'Avoid i18n indirection: Use literal strings instead of object properties in i18n.t() calls. Example: i18n.t("literal.id", values, "namespace")',
                });
              } else if (firstArg.type === 'CallExpression') {
                /** i18n.t(function(), ...) */
                context.report({
                  node: firstArg,
                  message: 'Avoid i18n indirection: Use literal strings instead of function calls in i18n.t() calls. Example: i18n.t("literal.id", values, "namespace")',
                });
              }
              /** Note: Literal strings (StringLiteral) are allowed and won't trigger this rule */
            }
          },
        };
      },
    },
  },
};
