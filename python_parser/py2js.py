import ast

class Py2Js(object):

    def __init__(self):
        self.ident_count = 0
        self.ident_enabled = True
        self.current_context = []

    def getCurrentContext(self):
        if not self.current_context: return None
        return self.current_context[-1]

    def translate(self, source):
        node = ast.parse(source)
        lines = self.process(node)
        print lines
        return '\n'.join(lines)

    def process(self, node):
        try:
            lines = getattr(self, node.__class__.__name__)(node)

        except Exception, e:
            print "Error node", node
            if hasattr(node, 'lineno'):
                print "Error en linea de codigo: %s" % node.lineno
            raise
        return lines

    def inline(self, node):
        try:
            old_ident = self.ident_enabled
            self.disableIdent()
            lines = getattr(self, node.__class__.__name__)(node)
            self.ident_enabled = old_ident
        except Exception, e:
            print "Error node", node
            if hasattr(node, 'lineno'):
                print "Error en linea de codigo: %s" % node.lineno
            raise
        return lines[0]

    def enableIdent(self):
        self.ident_enabled = True

    def disableIdent(self):
        self.ident_enabled = False

    def startBlock(self):
        self.ident_count += 1
        return "{"

    def endBlock(self):
        self.ident_count -= 1
        return "}"


    def ident(self):
        if not self.ident_enabled: return ''
        return "    " * self.ident_count

    def Module(self, node):
        lines = []
        #self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        #self.decrIdent()
        return lines

    def ClassDef(self, node):
        if len(node.bases) > 1: raise "too many bases"
        lines = []
        line = self.ident() + "var %s = Object.create(" % node.name
        if node.bases:
            line += "%s" % self.inline(node.bases[0])
        line += ")"
        lines.append(line)
        self.current_context.append(('CLASS', node.name))
        lines.extend(self.processBody(node.body, new_block=False))
        self.current_context.pop()
        return lines

    def Name(self, node):
        return [node.id]

    def Load(self, node):
        return [repr(node)]

    def processBody(self, body, **kwargs):
        insert_lines_at_start = kwargs.get('insert_lines_at_start', [])
        new_block = kwargs.get('new_block', True)
        lines = []
        if new_block: self.startBlock()
        for line in insert_lines_at_start:
            lines.append(self.ident() + line)
        for n in body:
            self.enableIdent()
            for line in self.process(n):
                lines.append(line)
        if new_block:
            self.endBlock()
            lines.append(self.ident() + "}")

        return lines

    def FunctionDef(self, node):
        lines = []
        ctx = self.getCurrentContext()
        start_lines = []
        if ctx and ctx[0] == 'CLASS':
            line = self.ident() + "%s.%s = function %s" % (ctx[1], node.name, node.name)
            start_lines.append('var %s = this;' % node.args.args[0].id)
        else:
            line = self.ident() + "function " + node.name
        line += self.inline(node.args)
        lines.append(line)

        lines.extend(self.processBody(node.body, insert_lines_at_start = start_lines))
        return lines

    def arguments(self, node):
        ctx = self.getCurrentContext()
        fr = 0
        if ctx and ctx[0] == 'CLASS': fr = 1
        args = ["%s" % x.id for x in node.args[fr:]]
        k = 0
        for default in node.defaults:
            args[len(args) - len(node.defaults)+k] = args[len(args) - len(node.defaults)+k] + "=%s" % self.inline(default)
            k +=1
        if node.vararg:
            args.append("*" + node.vararg)

        if node.kwarg:
            args.append("**" + node.kwarg)
        return ["(" + ','.join(args) + ") {"]

    def Param(self, node):
        return [repr(node)]

    def Print(self, node):
        line = self.ident() + "console.log("
        values = []
        for n in node.values:
            values.append("%s" % self.inline(n))
        line += ','.join(values) + ")"
        return [line]

    def UnaryOp(self, node):
        line = '(%s %s)' % (self.inline(node.op) ,self.inline(node.operand))
        return [line]

    def BinOp(self, node):
        line = '(%s %s %s)' % (self.inline(node.left),self.inline(node.op),self.inline(node.right))
        return [line]

    def BoolOp(self, node):
        return ["(%s %s %s)" % (self.inline(node.values[0]), self.inline(node.op), self.inline(node.values[1]))]

    def Or(self,node):
        return ['or']

    def And(self,node):
        return ['And']

    def Is(self,node):
        return ['is']


    def IsNot(self,node):
        return ['is not']

    def Str(self, node):
        return [self.ident() + "'%s'" % node.s]

    def Mod(self, node):
        return ["%"]

    def Num(self, node):
        return ["%s" % node.n]

    def Add(self, node):
        return ['+']

    def If(self, node):
        lines = []
        op = "if"
        if hasattr(node, "isElseIf"): op = 'else if'
        node.test.ident = False
        line  = self.ident() + op + " (" + self.inline(node.test) + ") {"
        lines.append(line)
        lines.extend(self.processBody(node.body))
        else_added = False;
        for n in node.orelse:
            n.isElseIf = True
            if (n.__class__ == node.__class__):
                lines.extend(self.process(n))
            else:
                if (not else_added):
                    lines.append(self.ident() + "else {")
                    else_added = True
                    self.startBlock()
                self.enableIdent()
                for line in self.process(n):
                    lines.append(line + ";")
        if else_added:
            self.endBlock()
            lines.append(self.ident() + "}")
        return lines

    def IfExp(self, node):
        node.body.ident = False
        node.test.ident = False
        line = "%s if %s" % (self.inline(node.body), self.inline(node.test))
        if node.orelse:
            node.orelse.ident = False
            line += " else %s" % self.inline(node.orelse)
        return [line]

    def Expr(self, node):
        lines = []
        lines.extend(self.process(node.value))
        return lines

    def Call(self, node):
        lines = []
        func = self.inline(node.func)
        args = []
        for arg in node.args:
            args.append("%s" % self.inline(arg))
        keywords = []
        for kw in node.keywords:
            kw.ident = False
            args.append(self.inline(kw))
        line = self.ident() + '%s(%s)' % (func, ','.join(args))
        return [line]

    def Compare(self, node):
        if len(node.comparators) > 1: raise "Multples comparadores no soportados"
        left = self.inline(node.left)
        op = self.inline(node.ops[0])
        cmp = self.inline(node.comparators[0])
        if op == 'in':
            line = "(%s.indexOf(%s) != -1)" % (cmp, left)
        else:
            line = "(%s %s %s)" % (left, op, cmp)
        return [line]

    def Eq(self, node):
        return ["=="]

    def Not(self, node):
        return [" not "]

    def NotEq(self, node):
        return ["!="]

    def keyword(self, node):
        node.value.ident = False
        return ['%s=%s' % (node.arg, self.process(node.value)[0])]

    def ImportFrom(self, node):
        lines = []
        names = []
        for name in node.names:
            n = "%s" % name.name
            if (name.asname): n += " as " + name.asname
            names.append(n)
        line = self.ident() + "from %s import %s" % (node.module, ','.join(names))
        lines.append(line)
        return lines

    def Import(self, node):
        lines = []
        names = []
        for name in node.names:
            n = "%s" % name.name
            if (name.asname): n += " as " + name.asname
            names.append(n)
        line = self.ident() + "import " + ','.join(names)
        return lines

    def Assign(self, node):
        targets = []
        for target in node.targets:
            targets.append(self.inline(target))
        lines = []
        if (node.value.__class__.__name__ == 'Call' and self.inline(node.value.func) == 'SuperClass'):
            lines.append(self.ident() + 'var ' + ','.join(targets) +  " = cm.CreateClass(Description, __filename)")
        else:
            lines.append(self.ident() + ','.join(targets) +  " = " + self.inline(node.value))
        return lines

    def Attribute(self, node):
        line = self.inline(node.value) + "." + node.attr
        return [line]

    def For(self, node):
        lines = []
        node.target.ident = False
        node.iter.ident = False
        target = self.inline(node.target)
        iter = self.inline(node.iter)
        line = self.ident() + "for (var %s_idx = 0; %s_idx < %s.length; %s_idx++) {" % (target, target, iter, target)
        lines.append(line)
        self.startBlock()
        line = self.ident() + "var %s = %s[%s_idx];" % (target, iter, target);
        self.endBlock()
        lines.append(line)
        lines.extend(self.processBody(node.body))
        else_added = False;
        for n in node.orelse:
            if (not else_added):
                lines.append(self.ident() + "else:")
                else_added = True
            self.incrIdent()
            lines.extend(self.process(n))
            self.decrIdent()
        return lines

    def Subscript(self, node):
        line = "%s%s" % (self.inline(node.value), self.inline(node.slice))
        return [line]

    def Index(self, node):
        return ["[%s]" % self.process(node.value)[0]]

    def Slice(self, node):
        s = []
        if node.lower:
            s.append(self.process(node.lower)[0])
        else: s.append('')
        if node.upper:
            s.append(self.process(node.upper)[0])
        else: s.append('')
        if node.step: s.append(self.process(node.step)[0])
        return ["[%s]" % ':'.join(s)]

    def Tuple(self, node):
        elts = []
        for elt in node.elts:
            elt.ident = False
            elts.append("%s" % self.process(elt)[0])
        return ["[" + ','.join(elts) + ']']

    def List(self, node):
        elts = []
        for elt in node.elts:
            elt.ident = False
            elts.append("%s" % self.process(elt)[0])
        return ["[" + ','.join(elts) + ']']

    def Break(self, node):
        return [self.ident() + 'break']

    def Lambda(self, node):
        node.body.ident = False
        line = "lambda %s %s" % (self.process(node.args)[0], self.process(node.body)[0])
        return [line]

    def Dict(self, node):
        return ["{%s}" % ','.join(["%s: %s" % (self.process(i[0])[0], self.process(i[1])[0])for i in zip(node.keys, node.values)])]

    def Mult(self, node):
        return ["*"]

    def Return(self, node):
        line = self.ident() + 'return'
        if node.value: line += ' %s' % self.inline(node.value)
        return [line]

    def TryExcept(self, node):
        lines = []
        lines.append(self.ident() + "try {")
        lines.extend(self.processBody(node.body))
        for handler in node.handlers:
            lines.extend(self.process(handler))
        if node.orelse:
            lines.append(self.ident() + "else:")
            self.startBlock()
            for n in node.orelse:
                lines.extend(self.process(n))
            self.endBlock()
        return lines

    def ExceptHandler(self, node):
        lines = []
        line = self.ident() + "catch"
        if node.name and not node.type:
            line += " (%s)" % self.inline(node.name)
        elif node.name and node.type:
            name = self.inline(node.name)
            line += " (%s if %s instance of %s)" % (name, name, self.inline(node.type))
        line += " {"
        lines.append(line)
        lines.extend(self.processBody(node.body))
        return lines


    def Raise(self, node):
        line = self.ident() + 'raise'
        if node.type:
            line +=' %s' % self.inline(node.type)
        return [line]

    def AugAssign(self, node):
        return [self.ident() + '%s %s= %s' % (self.inline(node.target), self.inline(node.op), self.inline(node.value))]

    def In(self, node):
        return ['in']

    def NotIn(self, node):
        return ['not in']

    def Lt(self, node):
        return ['<']

    def LtE(self, node):
        return ['<=']

    def Gt(self, node):
        return ['>']

    def GtE(self, node):
        return ['>=']

    def Sub(self, node):
        return ['-']

    def Div(self, node):
        return ['-']

    def Pow(self, node):
        return ['**']

    def Continue(self, node):
        return [self.ident(node.ident) + "continue"]

    def ListComp(self, node):
        generators = []
        for generator in node.generators:
            generators.append("%s" % self.inline(generator))
        line = self.ident() + "[%s %s]" % (self.inline(node.elt), ' '.join(generators))
        return [line]

    def comprehension(self, node):
        line = self.ident() + "for %s in %s" % (self.inline(node.target), self.inline(node.iter))
        for i in node.ifs:
            line += " if %s" % self.inline(i)
        return [line]

    def Pass(self, node):
        return [self.ident() + 'pass']

    def USub(self, node):
        return ['-']

    def GeneratorExp(self, node):
        generators = []
        for generator in node.generators:
            generators.append("%s" % self.inline(generator))
        line = self.ident() + "%s %s" % (self.inline(node.elt), ' '.join(generators))
        return [line]

    def While(self, node):
        lines = []
        op = "while"
        node.test.ident = False
        line  = self.ident() + op + " " + self.inline(node.test) + ":"
        lines.append(line)
        lines.extend(self.processBody(node.body))
        else_added = False;
        for n in node.orelse:
            n.isElseIf = True
            if (n.__class__ == node.__class__):
                lines.extend(self.process(n))
            else:
                if (not else_added):
                    lines.append(self.ident() + "else:")
                    else_added = True
                self.incrIdent()
                lines.extend(self.process(n))
                self.decrIdent()
        return lines

    def Global(self, node):
        names = []
        for name in node.names:
            names.append("%s" % name)
        return [self.ident(node.ident) + "global %s" % ','.join(names)]


