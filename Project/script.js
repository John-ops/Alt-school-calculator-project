
        const currentInput = document.getElementById('currentInput');
        const resultDisplay = document.getElementById('result');
        const historyList = document.getElementById('historyList');
        

        let currentExpression = '';
        let calculationHistory = [];
        

        function initCalculator() {
            currentInput.textContent = '0';
            resultDisplay.textContent = '';
        }
        

        function appendNumber(number) {
            if (currentExpression === '0' && number !== '.') {
                currentExpression = '';
            }
            

            if (number === '.' && currentExpression.includes('.') && 
                !isOperator(currentExpression.slice(-1))) {
                return;
            }
            
            currentExpression += number;
            currentInput.textContent = currentExpression;
        }
        

        function appendOperator(operator) {
            if (currentExpression === '' && operator !== '(' && operator !== '√') {
                return;
            }
            

            const lastChar = currentExpression.slice(-1);
            if (isOperator(lastChar) && operator !== '(' && operator !== ')') {
                currentExpression = currentExpression.slice(0, -1);
            }
            

            let displayOperator = operator;
            if (operator === '*') displayOperator = '×';
            if (operator === '/') displayOperator = '÷';
            
            currentExpression += operator;
            currentInput.textContent = currentExpression.replace(/\*/g, '×').replace(/\//g, '÷');
        }
        

        function isOperator(char) {
            return ['+', '-', '*', '/', '%', ].includes(char);
        }
        
        // Clear all input
        function clearAll() {
            currentExpression = '';
            resultDisplay.textContent = '';
            currentInput.textContent = '0';
        }
        

        function clearEntry() {
            if (currentExpression.length > 0) {
                currentExpression = currentExpression.slice(0, -1);
                currentInput.textContent = currentExpression || '0';
            }
        }
        

        function backspace() {
            clearEntry();
        }
        

        function calculate() {
            if (currentExpression === '') return;
            
            try {

                let expression = currentExpression
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');

                

                const openParens = (expression.match(/\(/g) || []).length;
                const closeParens = (expression.match(/\)/g) || []).length;
                if (openParens > closeParens) {
                    expression += ')'.repeat(openParens - closeParens);
                }
                

                const result = Function(`return (${expression})`)();
                

                const formattedResult = parseFloat(result.toFixed(10)).toString();
                

                resultDisplay.textContent = `= ${formattedResult}`;
                

                addToHistory(currentExpression, formattedResult);
                

                currentExpression = formattedResult;
            } catch (error) {
                resultDisplay.textContent = 'Error';
                setTimeout(() => {
                    resultDisplay.textContent = '';
                }, 1500);
            }
        }
                function addToHistory(expression, result) {

            calculationHistory.unshift({ expression, result });
            

            if (calculationHistory.length > 20) {
                calculationHistory.pop();
            }
            

            updateHistoryDisplay();
        }
        

        function updateHistoryDisplay() {
            if (calculationHistory.length === 0) {
                historyList.innerHTML = '<div class="empty-history">Your calculations will appear here</div>';
                return;
            }
            
            historyList.innerHTML = '';
            
            calculationHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-expression">${formatExpression(item.expression)}</div>
                    <div class="history-result">= ${item.result}</div>
                `;
                

                historyItem.addEventListener('click', () => {
                    currentExpression = item.result;
                    currentInput.textContent = currentExpression;
                    resultDisplay.textContent = '';
                });
                
                historyList.appendChild(historyItem);
            });
        }
        

        function formatExpression(expression) {
            return expression
                .replace(/\*/g, '×')
                .replace(/\//g, '÷');

        }
        

        document.addEventListener('keydown', (e) => {

            if (e.key >= '0' && e.key <= '9') {
                appendNumber(e.key);
            } else if (e.key === '.') {
                appendOperator('.');
            } else if (['+', '-', '*', '/', '%', ].includes(e.key)) {
                appendOperator(e.key);
            } else if (e.key === '(' || e.key === ')') {
                appendOperator(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                calculate();
            } else if (e.key === 'Escape') {
                clearAll();
            } else if (e.key === 'Backspace') {
                backspace();

            }
        });
        

        window.onload = initCalculator;