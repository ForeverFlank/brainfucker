function memory_table(data) {
    var table = document.createElement('table')
    var tbody = document.createElement('tbody')
    var rows = document.createElement('tr')
    data.forEach(element => {
        var cells = document.createElement('td');
        cells.appendChild(document.createTextNode(element));
        rows.appendChild(cells);
        tbody.appendChild(rows);
    });
    table.appendChild(tbody);
    table.setAttribute('id', 'memory');
    document.getElementById('memory_section').appendChild(table);
}

function update_table(data) {
    var table = document.getElementById('memory');
    for (var i = 0; i < 300; i++) {
        table.rows[0].cells[i].innerHTML = data[i];
    }
}

async function run_bf(program, out) {
    var memory = [];    // 30000 cells of memory
    var stack = [];     // jump stack
    var ptr = 0;        // memory pointer
    var op = true;      // do op after [ or not?
    var output = '';    

    // brackets check
    var count = 0
    for (var i = 0; i < program.length; i++) {
        if (program[i] === '[') count++;
        if (program[i] === ']') count--;
    }
    if (count != 0)
        throw 'Unmatched brackets'

    // fill array with zeros
    for (var i = 0; i < 300; memory[i++] = 0);

    // program
    for (var i = 0; i < program.length; i++) {
        switch (program[i]) {
            case '+':
                if (op) memory[ptr]++;
                memory[ptr] %= 256;
                break;
            case '-':
                if (op) memory[ptr]--;
                if (memory[ptr] == -1) memory[ptr] = 255;
                memory[ptr] %= 256;
                break;
            case '>':
                if (op) ptr++;
                break;
            case '<':
                if (op) ptr--;
                break;
            case '[':
                if (memory[ptr] == 0) op = false;
                else stack.push(i);
                break;
            case ']':
                if (memory[ptr] == 0) op = true;
                else i = stack.pop() - 1;
                break;
            case '.':
                output += String.fromCharCode(memory[ptr]);
                out.innerHTML = output
                break;
            default:
                break;
        }
        update_table(memory);
        await new Promise(r => setTimeout(r, 10));
    }
    return output;
}

function exec_bf()
{   
    // get input from text field
    var input_str = document.getElementById('bf_input').value;
    // try to compute
    try {
        var output_text = document.getElementById('bf_output');
        run_bf(input_str, output_text);   
    }
    catch (e) {
        document.getElementById('bf_output').innerHTML = e;
    }
}

var zeros = []
for (var i = 0; i < 300; zeros[i++] = 0);
memory_table(zeros);