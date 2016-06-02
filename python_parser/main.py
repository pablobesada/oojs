#encoding: utf-8
from tokenize import *
from StringIO import StringIO
import parser
import ast
from pprint import pprint

def decistmt(s):

    result = []
    g = generate_tokens(StringIO(s).readline)   # tokenize the string
    for toknum, tokval, _, _, _ in g:
        print toknum, tokval
        if toknum == NUMBER and '.' in tokval:  # replace NUMBER tokens
            result.extend([
                (NAME, 'Decimal'),
                (OP, '('),
                (STRING, repr(tokval)),
                (OP, ')')
            ])
        else:
            result.append((toknum, tokval))
    return untokenize(result)

from decimal import Decimal
s = '''
#from pepe import pp, caca as meme, tete as pipi, kk

class A(object):
    def __init__(self, a, *args, **kwargs):
        print "en constructor: %s" % (2.3333333333333 + 5.666666666666)
        if not True:
            print "aca"
        elif 1!=2:
            print "alla"
        elif False:
            print "alla"
        else:
            print "ahora"
            print "jeje"
    def pepe(self):
        print "en pepe"

A(3,4,5, g=123, kk=33)
b = [1,2,3,[3,4,5,6],6]
c = ('a', 'b', 'c')
for a in b[3:]:
    print a
    hello()
    bb = cc('pepito')
else:
    print "hey"

item.setText(map(lambda x: utf8(x) if isinstance(x, long) else x.encode("latin-1","ignore"), child))
#map(lambda x: utf8(x), child)
item.window = self
'''
s = """
def afterCopy(self, KeepOrigins=False):
    ParentInvoice.afterCopy(self)
    if jeje:
        return b.pepe[0]
    else: return n78
try:
    pepe()
except:
    jeje()
    raise e
    raise Exception('eppe')
    raise
except Exception, e:
    print 123
except Exception as e:
    print 123
except Exception:
    print 123
else:
    print "67"

a +=1
b= (-x,4)
if fieldname in ("Comment","DisputedFlag","EstPayDate"):    # only field you should be able to change after oking
    return True

#["%s" % s for  s in self.finalStatus() if a == b if p==0]
#totalmargin = sum(invrow.GMargin for invrow in self.Items)
#def a(se):
#    self.Cost = (factor * record.convert2myCurrency(cost,cur))
#    a = '''acá e
#stoy probando'''
#while pepito and juancito:
#    print acaestoy
#    a +=1
#else:
#    print nunca
#    b += 1

"""
s = open("/Users/pablo/Desktop/desarrollos/oo/develop/standard/windows/InvoiceWindow.py", "r").read()
#s = open("/Users/pablo/Desktop/desarrollos/oo/develop/core/RawRecord.py", "r").read()

def useToken():

    #decistmt(s)
    #"print +Decimal ('21.3e-5')*-Decimal ('.1234')/Decimal ('81.7')"

    exec(s)
    #-3.21716034272e-007
    k = decistmt(s)
    print k
    exec(k)
    #-3.217160342717258261933904529E-7


def useParser():
    t = parser.st2tuple(parser.suite(s))
    for p in t:
        print p

class NodeProcessor:
    def __init__(self):
        self.__ident__ = 0

    def incrIdent(self):
        self.__ident__ +=1

    def decrIdent(self):
        self.__ident__ -= 1

    def ident(self, doit=True):
        if not doit: return ''
        return "  " * self.__ident__

    def process(self, node):
        try:
            if not hasattr(node, 'ident'): node.ident = True
            lines = getattr(self, node.__class__.__name__)(node)
        except Exception, e:
            print "Error node", node
            if hasattr(node, 'lineno'):
                print "Error en linea de codigo: %s" % node.lineno
            raise
        return lines

    def Module(self, node):
        lines = []
        #self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        #self.decrIdent()
        return lines

    def ClassDef(self, node):
        lines = []
        line = self.ident() + "class " + node.name
        line += "(%s):" % self.process(node.bases[0])[0]
        lines.append(line)
        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
        return lines

    def Name(self, node):
        return [node.id]

    def Load(self, node):
        return [repr(node)]

    def FunctionDef(self, node):
        lines = []
        line = self.ident() + "def " + node.name
        line += self.process(node.args)[0]
        lines.append(line)
        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
        return lines

    def arguments(self, node):
        args = ["%s" % x.id for x in node.args]
        k = 0
        for default in node.defaults:
            args[len(args) - len(node.defaults)+k] = args[len(args) - len(node.defaults)+k] + "=%s" % self.process(default)[0]
            k +=1
        if node.vararg:
            args.append("*" + node.vararg)

        if node.kwarg:
            args.append("**" + node.kwarg)
        return ["(" + ','.join(args) + "):"]

    def Param(self, node):
        return [repr(node)]

    def Print(self, node):
        line = self.ident() + "print "
        values = []
        for n in node.values:
            n.ident = False
            values.append("%s" % self.process(n)[0])
        line += ','.join(values)
        return [line]

    def UnaryOp(self, node):
        line = '(%s %s)' % (self.process(node.op)[0] ,self.process(node.operand)[0])
        return [line]

    def BinOp(self, node):
        #print dir(node.left)
        node.right.ident = False
        node.left.ident = False
        line = '(%s %s %s)' % (self.process(node.left)[0] ,self.process(node.op)[0],self.process(node.right)[0])
        return [line]

    def BoolOp(self, node):
        return ["(%s %s %s)" % (self.process(node.values[0])[0], self.process(node.op)[0], self.process(node.values[1])[0])]

    def Or(self,node):
        return ['or']

    def And(self,node):
        return ['And']

    def Is(self,node):
        return ['is']


    def IsNot(self,node):
        return ['is not']

    def Str(self, node):
        if '\n' in node.s:
            return [self.ident(node.ident) + "'''%s'''" % node.s]
        else:
            return [self.ident(node.ident) + "'%s'" % node.s]

    def Mod(self, node):
        return ["%"]

    def Num(self, node):
        return ["%s" % node.n]

    def Add(self, node):
        return ['+']

    def If(self, node):
        lines = []
        op = "if"
        if hasattr(node, "isElseIf"): op = 'elif'
        node.test.ident = False
        line  = self.ident() + op + " " + self.process(node.test)[0] + ":"
        lines.append(line)
        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
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

    def IfExp(self, node):
        node.body.ident = False
        node.test.ident = False
        line = "%s if %s" % (self.process(node.body)[0], self.process(node.test)[0])
        if node.orelse:
            node.orelse.ident = False
            line += "  else %s" % self.process(node.orelse)[0]
        return [line]

    def Expr(self, node):
        lines = []
        lines.extend(self.process(node.value))
        return lines

    def Call(self, node):
        lines = []
        func = self.process(node.func)[0]
        args = []
        for arg in node.args:
            arg.ident = False
            args.append("%s" % self.process(arg)[0])
        keywords = []
        for kw in node.keywords:
            kw.ident = False
            args.append(self.process(kw)[0])
        #line = self.ident() + '%s(%s)' % (func, ','.join(args))
        line = ''
        if node.ident: line = self.ident()
        line += '%s(%s)' % (func, ','.join(args))
        return [line]

    def Compare(self, node):
        ops = ""
        for op in node.ops:
            ops += self.process(op)[0]
        cmps = ""
        for cmp in node.comparators:
            cmp.ident = False
            cmps += "%s" % self.process(cmp)[0]
        node.left.ident = False
        line = "(%s %s %s)" % (self.process(node.left)[0], ops,cmps)
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
            targets.append(self.process(target)[0])
        lines = []
        node.value.ident = False
        #print node.value.func
        lines.append(self.ident() + ','.join(targets) +  " = " + self.process(node.value)[0])
        return lines

    def Attribute(self, node):
        lines = []
        line = ''
        #if node.ident: line = self.ident()
        #print node.value, node.attr
        node.value.ident = node.ident
        line += self.process(node.value)[0] + "." + node.attr
        lines.append(line)
        return lines

    def For(self, node):
        lines = []
        node.target.ident = False
        node.iter.ident = False
        line = self.ident() + "for %s in %s:" % (self.process(node.target)[0],self.process(node.iter)[0])
        lines.append(line)

        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
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
        node.value.ident = node.ident
        line = "%s%s" % (self.process(node.value)[0], self.process(node.slice)[0])
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
        return ["(" + ','.join(elts) + ')']

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
        line = ''
        if node.ident: line = self.ident()
        line += 'return'
        if node.value: line += ' %s' % self.process(node.value)[0]
        return [line]

    def TryExcept(self, node):
        lines = []
        lines.append(self.ident() + "try:")
        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
        for handler in node.handlers:
            lines.extend(self.process(handler))
        if node.orelse:
            lines.append(self.ident() + "else:")
            self.incrIdent()
            for n in node.orelse:
                lines.extend(self.process(n))
            self.decrIdent()

        #lines.append(self.ident() + "except:")
        """
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
        """
        return lines

    def ExceptHandler(self, node):
        lines = []
        line = self.ident() + "except"
        if node.type:
            line += " %s" % self.process(node.type)[0]
        if node.name:
            line += " as %s" % self.process(node.type)[0]
        line += ":"
        lines.append(line)
        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
        return lines


    def Raise(self, node):
        line = ''
        if node.ident: line = self.ident()
        line += 'raise'
        if node.type:
            node.type.ident = False
            line +=' %s' % self.process(node.type)[0]
        return [line]

    def AugAssign(self, node):
        node.value.ident = False
        return [self.ident(node.ident) + '%s %s= %s' % (self.process(node.target)[0], self.process(node.op)[0], self.process(node.value)[0])]

    def In(self, node):
        return ['in']

    def NotIn(self, node):
        return ['not in']

    def Lt(self, node):
        return ['<']

    def LtE(self, node):
        return ['<= ']

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
            generator.ident = False
            generators.append("%s" % self.process(generator)[0])
        node.elt.ident = False
        line = self.ident(node.ident) + "[%s %s]" % (self.process(node.elt)[0], ' '.join(generators))
        return [line]

    def comprehension(self, node):
        node.target.ident = False
        node.iter.ident = False
        line = self.ident(node.ident) + "for %s in %s" % (self.process(node.target)[0], self.process(node.iter)[0])
        for i in node.ifs:
            i.ident = False
            line += " if %s" % self.process(i)[0]
        return [line]

    def Pass(self, node):
        return [self.ident(node.ident) + 'pass']

    def USub(self, node):
        return ['-']

    def GeneratorExp(self, node):
        generators = []
        for generator in node.generators:
            generator.ident = False
            generators.append("%s" % self.process(generator)[0])
        node.elt.ident = False
        line = self.ident(node.ident) + "%s %s" % (self.process(node.elt)[0], ' '.join(generators))
        return [line]

    def While(self, node):
        lines = []
        op = "while"
        node.test.ident = False
        line  = self.ident() + op + " " + self.process(node.test)[0] + ":"
        lines.append(line)
        self.incrIdent()
        for n in node.body:
            lines.extend(self.process(n))
        self.decrIdent()
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

def displayNode(n):
    lines = NodeProcessor().process(n)
    for line in lines:
        print line
    for f  in n._fields:
        #print f + ": " + str(n.__dict__[f]) + ",",
        pass
    print

def displayASTNodeTree(node, tab):
    for p in ast.iter_child_nodes(node):
        print " "*tab,
        displayNode(p)
        displayASTNodeTree(p, tab+2)

def useAST():
    a = ast.parse(s)
    lines = NodeProcessor().process(a)
    code = '\n'.join(lines)
    print code
    #exec(code)

sa = """
for x in range(14):
    print x
a = b
"""

#useAST()

from py2js import Py2Js



T = Py2Js()
print T.translate(s)