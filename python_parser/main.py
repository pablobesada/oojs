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

class A(object):
    def __init__(self, a, *args, **kwargs):
        print "en constructor: %s" % (2.3333333333333 + 5.666666666666)
        if True:
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
'''

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

    def ident(self):
        return "  " * self.__ident__

    def process(self, node):
        lines = getattr(self, node.__class__.__name__)(node)
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
        line += "(%s):" % str(node.bases[0].id)
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
            args[len(args) - len(node.defaults)+k] = args[len(args) - len(node.defaults)+k] + "=%s" % default.n
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
        for n in node.values:
            line += self.process(n)[0]
        return [line]

    def BinOp(self, node):
        #print dir(node.left)
        line = '(%s %s %s)' % (self.process(node.left)[0] ,self.process(node.op)[0],self.process(node.right)[0])
        return [line]

    def Str(self, node):
        return ["'%s'" % node.s]

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

    def Expr(self, node):
        lines = []
        lines.extend(self.process(node.value))
        return lines

    def Call(self, node):
        lines = []
        func = self.process(node.func)[0]
        args = ["%s" % self.process(arg)[0] for arg in node.args]
        keywords = []
        for kw in node.keywords:
            args.append(self.process(kw)[0])
        line = self.ident() + '%s(%s)' % (func, ','.join(args))
        return [line]

    def Compare(self, node):
        ops = ""
        for op in node.ops:
            ops += self.process(op)[0]
        cmps = ""
        for cmp in node.comparators:
            cmps += "%s" % self.process(cmp)[0]
        line = "(%s %s %s)" % (self.process(node.left)[0], ops,cmps)
        return [line]

    def Eq(self, node):
        return ["=="]

    def NotEq(self, node):
        return ["!="]

    def keyword(self, node):
        return ['%s=%s' % (node.arg, self.process(node.value)[0])]

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
    exec(code)

useAST()