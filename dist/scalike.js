(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.scalike = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Optional_1 = require('./Optional');
// Function
// ======================================================
function Right(b) {
    return new RightImpl(b);
}
exports.Right = Right;
function Left(a) {
    return new LeftImpl(a);
}
exports.Left = Left;
// Class - Either
// ======================================================
var EitherImpl = (function () {
    function EitherImpl() {
    }
    EitherImpl.prototype.toString = function () {
        return this.isLeft ? "Left(" + this.value + ")" : "Right(" + this.value + ")";
    };
    EitherImpl.prototype.left = function () {
        return new LeftProjection(this);
    };
    EitherImpl.prototype.right = function () {
        return new RightProjection(this);
    };
    EitherImpl.prototype.fold = function (fa, fb) {
        return this.isLeft ? fa(this.value) : fb(this.value);
    };
    EitherImpl.prototype.swap = function () {
        return this.isLeft ? Right(this.value) : Left(this.value);
    };
    return EitherImpl;
})();
var LeftImpl = (function (_super) {
    __extends(LeftImpl, _super);
    function LeftImpl(value) {
        _super.call(this);
        this.value = value;
        this.isLeft = true;
        this.isRight = false;
    }
    return LeftImpl;
})(EitherImpl);
var RightImpl = (function (_super) {
    __extends(RightImpl, _super);
    function RightImpl(value) {
        _super.call(this);
        this.value = value;
        this.isLeft = false;
        this.isRight = true;
    }
    return RightImpl;
})(EitherImpl);
// Class - Projection
// ======================================================
var LeftProjection = (function () {
    function LeftProjection(self) {
        this.self = self;
    }
    LeftProjection.prototype.toString = function () {
        return "LeftProjection(" + this.self.toString() + ")";
    };
    LeftProjection.prototype.get = function () {
        if (this.self.isLeft) {
            return this.self.value;
        }
        else {
            throw new Error('cannot get Left value');
        }
    };
    LeftProjection.prototype.foreach = function (f) {
        if (this.self.isLeft) {
            f(this.self.value);
        }
    };
    LeftProjection.prototype.getOrElse = function (x) {
        return this.self.isLeft ? this.self.value : x;
    };
    LeftProjection.prototype.forall = function (f) {
        return this.self.isLeft ? f(this.self.value) : true;
    };
    LeftProjection.prototype.exists = function (f) {
        return this.self.isLeft ? f(this.self.value) : false;
    };
    LeftProjection.prototype.filter = function (f) {
        if (this.self.isLeft) {
            return f(this.self.value) ? Optional_1.Optional(this) : Optional_1.None;
        }
        else {
            return Optional_1.None;
        }
    };
    LeftProjection.prototype.map = function (f) {
        return this.self.isLeft ? Left(f(this.self.value)) : this.self;
    };
    LeftProjection.prototype.flatMap = function (f) {
        return this.self.isLeft ? f(this.self.value) : this.self;
    };
    LeftProjection.prototype.toOptional = function () {
        return this.self.isLeft ? Optional_1.Optional(this.self.value) : Optional_1.None;
    };
    return LeftProjection;
})();
exports.LeftProjection = LeftProjection;
var RightProjection = (function () {
    function RightProjection(self) {
        this.self = self;
    }
    RightProjection.prototype.toString = function () {
        return "RightProjection(" + this.self.toString() + ")";
    };
    RightProjection.prototype.get = function () {
        if (this.self.isRight) {
            return this.self.value;
        }
        else {
            throw new Error('cannot get Right value');
        }
    };
    RightProjection.prototype.foreach = function (f) {
        if (this.self.isRight) {
            f(this.self.value);
        }
    };
    RightProjection.prototype.getOrElse = function (x) {
        return this.self.isRight ? this.self.value : x;
    };
    RightProjection.prototype.forall = function (f) {
        return this.self.isRight ? f(this.self.value) : true;
    };
    RightProjection.prototype.exists = function (f) {
        return this.self.isRight ? f(this.self.value) : false;
    };
    RightProjection.prototype.filter = function (f) {
        if (this.self.isRight) {
            return f(this.self.value) ? Optional_1.Optional(this) : Optional_1.None;
        }
        else {
            return Optional_1.None;
        }
    };
    RightProjection.prototype.map = function (f) {
        return this.self.isLeft ? this.self : Right(f(this.self.value));
    };
    RightProjection.prototype.flatMap = function (f) {
        return this.self.isLeft ? this.self : f(this.self.value);
    };
    RightProjection.prototype.toOptional = function () {
        return this.self.isRight ? Optional_1.Optional(this.self.value) : Optional_1.None;
    };
    return RightProjection;
})();
exports.RightProjection = RightProjection;

},{"./Optional":3}],2:[function(require,module,exports){
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
var Try_1 = require('./Try');
var Optional_1 = require('./Optional');
function Future(f) {
    if (f instanceof Promise) {
        return new FutureImpl(f);
    }
    else {
        return new FutureImpl(new Promise(function (resolve, reject) {
            Try_1.Try(f).fold(function (e) { return reject(e); }, function (a) { return resolve(a); });
        }));
    }
}
exports.Future = Future;
var Future;
(function (Future) {
    function fromPromise(p) {
        return new FutureImpl(p);
    }
    Future.fromPromise = fromPromise;
    function unit() {
        return new FutureImpl(Promise.resolve(undefined), Try_1.Success(undefined));
    }
    Future.unit = unit;
    function failed(e) {
        return new FutureImpl(Promise.reject(e), Try_1.Failure(e));
    }
    Future.failed = failed;
    function successful(a) {
        return new FutureImpl(Promise.resolve(a), Try_1.Success(a));
    }
    Future.successful = successful;
    function fromTry(t) {
        var _this = this;
        return t.fold(function (e) { return _this.failed(e); }, function (a) { return _this.successful(a); });
    }
    Future.fromTry = fromTry;
    function sequence(fus) {
        return new FutureImpl(Promise.all(fus.map(function (a) { return a.getPromise(); })));
    }
    Future.sequence = sequence;
    function firstCompletedOf(fus) {
        return new FutureImpl(Promise.race(fus.map(function (a) { return a.getPromise(); })));
    }
    Future.firstCompletedOf = firstCompletedOf;
    function find(fus, f) {
        var searchRecursive = function (fr) {
            if (fr.length === 0) {
                return Future.successful(Optional_1.None);
            }
            var fh = fr[0], ft = fr.slice(1);
            return fh.transformWith(function (t) {
                return t.fold(function (e) { return searchRecursive(ft); }, function (a) { return f(a) ? Future.successful(Optional_1.Optional(a)) : searchRecursive(ft); });
            });
        };
        return searchRecursive(fus);
    }
    Future.find = find;
    function foldLeft(fu, zero, f) {
        var recursive = function (fr, acc) {
            if (fr.length === 0) {
                return Future.successful(acc);
            }
            var fh = fr[0], ft = fr.slice(1);
            return fh.flatMap(function (a) { return recursive(ft, f(acc, a)); });
        };
        return recursive(fu, zero);
    }
    Future.foldLeft = foldLeft;
    // reduceLeft<A extends B, B>
    // Error : Constraint of a type parameter cannot reference any type parameter from the same type parameter list.
    // 無理くさいので一旦保留...
    //export function reduceLeft<A, B>(fu: Array<Future<A>>, f: (b: B, a: A) => B): Future<B> {
    //  if (fu.length === 0) {
    //    return Future.failed<B>(new Error('reduceLeft attempted on empty collection'));
    //  } else {
    //    const [fh, ...ft] = fu;
    //    return fh.flatMap<B>(zero => Future.foldLeft<A, B>(ft, zero, f));
    //  }
    //}
    function reduceLeft(fu, f) {
        throw 'TODO';
    }
    Future.reduceLeft = reduceLeft;
    function traverse(fu, f) {
        var fzero = Future.successful([]);
        if (fu.length === 0) {
            return fzero;
        }
        return fu.reduce(function (fbs, a) {
            return fbs.zipWith(f(a), function (bs, fa) { bs.push(fa); return bs; });
        }, fzero);
    }
    Future.traverse = traverse;
})(Future = exports.Future || (exports.Future = {}));
var FutureImpl = (function () {
    function FutureImpl(promise, already) {
        var _this = this;
        this.promise = promise;
        this.completeValue = Optional_1.None;
        if (already) {
            this.completeValue = Optional_1.Some(already);
        }
        else {
            promise.then(function (a) { return _this.completeValue = Optional_1.Some(Try_1.Success(a)); }, function (e) { return _this.completeValue = Optional_1.Some(Try_1.Failure(e)); });
        }
    }
    FutureImpl.prototype.onComplete = function (f) {
        this.promise.then(function (a) { return f(Try_1.Success(a)); }, function (e) { return f(Try_1.Failure(e)); });
    };
    FutureImpl.prototype.isCompleted = function () {
        return this.completeValue.nonEmpty;
    };
    FutureImpl.prototype.value = function () {
        return this.completeValue;
    };
    FutureImpl.prototype.failed = function () {
        return this.transform(function (t) {
            return t.fold(function (e) { return Try_1.Success(e); }, function (a) { return Try_1.Failure(new Error('Future.failed not completed with a throwable.')); });
        });
    };
    FutureImpl.prototype.foreach = function (f) {
        this.onComplete(function (t) { return t.foreach(f); });
    };
    FutureImpl.prototype.getPromise = function () {
        return this.promise;
    };
    FutureImpl.prototype.tryPromise = function (f) {
        try {
            return f();
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    FutureImpl.prototype.transform = function (f) {
        var _this = this;
        return new FutureImpl(this.promise.then(function (a) { return _this.tryPromise(function () { return f(Try_1.Success(a)).fold(function (e) { return Promise.reject(e); }, function (b) { return Promise.resolve(b); }); }); }, function (e) { return _this.tryPromise(function () { return f(Try_1.Failure(e)).fold(function (e) { return Promise.reject(e); }, function (b) { return Promise.resolve(b); }); }); }));
    };
    FutureImpl.prototype.transform1 = function (fs, ff) {
        return this.transform(function (t) {
            return t.fold(function (e) { try {
                return Try_1.Failure(ff(e));
            }
            catch (e) {
                return Try_1.Failure(e);
            } }, function (a) { return Try_1.Try(function () { return fs(a); }); });
        });
    };
    FutureImpl.prototype.transformWith = function (f) {
        var _this = this;
        return new FutureImpl(this.promise.then(function (a) { return _this.tryPromise(function () { return f(Try_1.Success(a)).getPromise(); }); }, function (e) { return _this.tryPromise(function () { return f(Try_1.Failure(e)).getPromise(); }); }));
    };
    FutureImpl.prototype.map = function (f) {
        return this.transform(function (t) { return t.map(f); });
    };
    FutureImpl.prototype.flatMap = function (f) {
        return this.transformWith(function (t) { return t.fold(function (e) { return Future.failed(e); }, function (a) { return f(a); }); });
    };
    FutureImpl.prototype.filter = function (f) {
        return this.map(function (a) {
            if (f(a)) {
                return a;
            }
            else {
                throw new Error('Future.filter predicate is not satisfied');
            }
        });
    };
    FutureImpl.prototype.recover = function (f) {
        return this.transform(function (t) { return t.recover(f); });
    };
    FutureImpl.prototype.recoverWith = function (f) {
        return this.transformWith(function (t) {
            return t.fold(function (e) { return f(e).fold(Future.failed(e), function (a) { return a; }); }, function (a) { return Future.successful(a); });
        });
    };
    FutureImpl.prototype.zip = function (fu) {
        return this.flatMap(function (a) { return fu.map(function (b) { return [a, b]; }); });
    };
    FutureImpl.prototype.zipWith = function (fu, f) {
        return this.flatMap(function (a) { return fu.map(function (b) { return f(a, b); }); });
    };
    FutureImpl.prototype.fallbackTo = function (fu) {
        var _this = this;
        return this.recoverWith(function (e) { return Optional_1.Some(fu); }).recoverWith(function (e) { return Optional_1.Some(_this); });
    };
    FutureImpl.prototype.andThen = function (f) {
        return this.transform(function (t) {
            try {
                f(t);
            }
            catch (e) {
                if (typeof console !== 'undefined') {
                    console.error(e);
                }
            }
            return t;
        });
    };
    FutureImpl.prototype.apply1 = function (ob, f) {
        return this.zipWith(ob, f);
    };
    FutureImpl.prototype.apply2 = function (ob, oc, f) {
        return this.flatMap(function (a) { return ob.flatMap(function (b) { return oc.map(function (c) { return f(a, b, c); }); }); });
    };
    FutureImpl.prototype.chain = function (ob) {
        return new FutureBuilder1(this, ob);
    };
    return FutureImpl;
})();
/**
 * FutureBuilder.
 */
var FutureBuilder1 = (function () {
    function FutureBuilder1(oa, ob) {
        this.oa = oa;
        this.ob = ob;
    }
    FutureBuilder1.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.map(function (b) { return f(a, b); }); });
    };
    FutureBuilder1.prototype.chain = function (oc) {
        return new FutureBuilder2(this.oa, this.ob, oc);
    };
    return FutureBuilder1;
})();
exports.FutureBuilder1 = FutureBuilder1;
var FutureBuilder2 = (function () {
    function FutureBuilder2(oa, ob, oc) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
    }
    FutureBuilder2.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.map(function (c) { return f(a, b, c); }); }); });
    };
    FutureBuilder2.prototype.chain = function (od) {
        return new FutureBuilder3(this.oa, this.ob, this.oc, od);
    };
    return FutureBuilder2;
})();
exports.FutureBuilder2 = FutureBuilder2;
var FutureBuilder3 = (function () {
    function FutureBuilder3(oa, ob, oc, od) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
    }
    FutureBuilder3.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) {
            return _this.od.map(function (d) { return f(a, b, c, d); });
        }); }); });
    };
    FutureBuilder3.prototype.chain = function (oe) {
        return new FutureBuilder4(this.oa, this.ob, this.oc, this.od, oe);
    };
    return FutureBuilder3;
})();
exports.FutureBuilder3 = FutureBuilder3;
var FutureBuilder4 = (function () {
    function FutureBuilder4(oa, ob, oc, od, oe) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
        this.oe = oe;
    }
    FutureBuilder4.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) { return _this.od.flatMap(function (d) {
            return _this.oe.map(function (e) { return f(a, b, c, d, e); });
        }); }); }); });
    };
    FutureBuilder4.prototype.chain = function (of) {
        return new FutureBuilder5(this.oa, this.ob, this.oc, this.od, this.oe, of);
    };
    return FutureBuilder4;
})();
exports.FutureBuilder4 = FutureBuilder4;
var FutureBuilder5 = (function () {
    function FutureBuilder5(oa, ob, oc, od, oe, of) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
        this.oe = oe;
        this.of = of;
    }
    FutureBuilder5.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) { return _this.od.flatMap(function (d) { return _this.oe.flatMap(function (e) {
            return _this.of.map(function (ff) { return f(a, b, c, d, e, ff); });
        }); }); }); }); });
    };
    return FutureBuilder5;
})();
exports.FutureBuilder5 = FutureBuilder5;

},{"./Optional":3,"./Try":4}],3:[function(require,module,exports){
/* tslint:disable:no-use-before-declare */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Optional function.
 *
 * @example
 * > Optional(1) // Some(1)
 * > Optional('a') // Some('a')
 * > Optional(undefined) // None
 * > Optional(null) // None
 *
 * @param a value
 * @returns {Optional<A>} Optional type
 */
function Optional(a) {
    return (a !== undefined && a !== null) ? new SomeImpl(a) : exports.None;
}
exports.Optional = Optional;
/**
 * Some is represents not empty. ('not undefined and not null')
 * @param a value
 * @returns {Optional<A>} Some
 */
function Some(a) {
    return new SomeImpl(a);
}
exports.Some = Some;
/**
 * Optional implements.
 */
var OptionalImpl = (function () {
    function OptionalImpl() {
    }
    /**
     * Returns the option's value.
     * This is shouldn't use.
     */
    OptionalImpl.prototype.get = function () {
        throw 'err';
    };
    /**
     * If Some is return A, None is return passing value B.
     * @param a use if None
     */
    OptionalImpl.prototype.getOrElse = function (a) {
        return this.isEmpty ? a : this.get();
    };
    OptionalImpl.prototype.map = function (f) {
        return this.isEmpty ? exports.None : new SomeImpl(f(this.get()));
    };
    OptionalImpl.prototype.fold = function (ifEmpty, f) {
        return this.isEmpty ? ifEmpty : f(this.get());
    };
    OptionalImpl.prototype.flatten = function () {
        throw 'TODO';
    };
    OptionalImpl.prototype.filter = function (f) {
        return (this.isEmpty || f(this.get())) ? this : exports.None;
    };
    OptionalImpl.prototype.contains = function (b) {
        return !this.isEmpty && this.get() === b;
    };
    OptionalImpl.prototype.exists = function (f) {
        return !this.isEmpty && f(this.get());
    };
    OptionalImpl.prototype.forall = function (f) {
        return this.isEmpty || f(this.get());
    };
    OptionalImpl.prototype.flatMap = function (f) {
        return this.isEmpty ? exports.None : f(this.get());
    };
    OptionalImpl.prototype.foreach = function (f) {
        if (!this.isEmpty) {
            f(this.get());
        }
    };
    OptionalImpl.prototype.orElse = function (d) {
        return this.isEmpty ? d : this;
    };
    OptionalImpl.prototype.apply1 = function (ob, f) {
        return this.flatMap(function (a) { return ob.map(function (b) { return f(a, b); }); });
    };
    OptionalImpl.prototype.apply2 = function (ob, oc, f) {
        return this.flatMap(function (a) { return ob.flatMap(function (b) { return oc.map(function (c) { return f(a, b, c); }); }); });
    };
    OptionalImpl.prototype.chain = function (ob) {
        return new OptionalBuilder1(this, ob);
    };
    return OptionalImpl;
})();
var SomeImpl = (function (_super) {
    __extends(SomeImpl, _super);
    function SomeImpl(value) {
        _super.call(this);
        this.value = value;
        this.isEmpty = false;
        this.nonEmpty = true;
    }
    SomeImpl.prototype.get = function () {
        return this.value;
    };
    SomeImpl.prototype.toString = function () {
        return 'Some(' + this.value + ')';
    };
    return SomeImpl;
})(OptionalImpl);
var NoneImpl = (function (_super) {
    __extends(NoneImpl, _super);
    function NoneImpl() {
        _super.apply(this, arguments);
        this.isEmpty = true;
        this.nonEmpty = false;
    }
    NoneImpl.prototype.get = function () {
        throw new TypeError('None can not #get');
    };
    NoneImpl.prototype.toString = function () {
        return 'None';
    };
    return NoneImpl;
})(OptionalImpl);
/**
 * None is represents empty.
 */
exports.None = new NoneImpl();
/**
 * OptionalBuilder.
 */
var OptionalBuilder1 = (function () {
    function OptionalBuilder1(oa, ob) {
        this.oa = oa;
        this.ob = ob;
    }
    OptionalBuilder1.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.map(function (b) { return f(a, b); }); });
    };
    OptionalBuilder1.prototype.chain = function (oc) {
        return new OptionalBuilder2(this.oa, this.ob, oc);
    };
    return OptionalBuilder1;
})();
exports.OptionalBuilder1 = OptionalBuilder1;
var OptionalBuilder2 = (function () {
    function OptionalBuilder2(oa, ob, oc) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
    }
    OptionalBuilder2.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.map(function (c) { return f(a, b, c); }); }); });
    };
    OptionalBuilder2.prototype.chain = function (od) {
        return new OptionalBuilder3(this.oa, this.ob, this.oc, od);
    };
    return OptionalBuilder2;
})();
exports.OptionalBuilder2 = OptionalBuilder2;
var OptionalBuilder3 = (function () {
    function OptionalBuilder3(oa, ob, oc, od) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
    }
    OptionalBuilder3.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) {
            return _this.od.map(function (d) { return f(a, b, c, d); });
        }); }); });
    };
    OptionalBuilder3.prototype.chain = function (oe) {
        return new OptionalBuilder4(this.oa, this.ob, this.oc, this.od, oe);
    };
    return OptionalBuilder3;
})();
exports.OptionalBuilder3 = OptionalBuilder3;
var OptionalBuilder4 = (function () {
    function OptionalBuilder4(oa, ob, oc, od, oe) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
        this.oe = oe;
    }
    OptionalBuilder4.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) { return _this.od.flatMap(function (d) {
            return _this.oe.map(function (e) { return f(a, b, c, d, e); });
        }); }); }); });
    };
    OptionalBuilder4.prototype.chain = function (of) {
        return new OptionalBuilder5(this.oa, this.ob, this.oc, this.od, this.oe, of);
    };
    return OptionalBuilder4;
})();
exports.OptionalBuilder4 = OptionalBuilder4;
var OptionalBuilder5 = (function () {
    function OptionalBuilder5(oa, ob, oc, od, oe, of) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
        this.oe = oe;
        this.of = of;
    }
    OptionalBuilder5.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) { return _this.od.flatMap(function (d) { return _this.oe.flatMap(function (e) {
            return _this.of.map(function (ff) { return f(a, b, c, d, e, ff); });
        }); }); }); }); });
    };
    return OptionalBuilder5;
})();
exports.OptionalBuilder5 = OptionalBuilder5;

},{}],4:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Optional_1 = require('./Optional');
function Try(f) {
    try {
        return new SuccessImpl(f());
    }
    catch (e) {
        return new FailureImpl(e);
    }
}
exports.Try = Try;
function Success(a) {
    return new SuccessImpl(a);
}
exports.Success = Success;
function Failure(e) {
    return new FailureImpl(e);
}
exports.Failure = Failure;
var TryImpl = (function () {
    function TryImpl() {
    }
    TryImpl.prototype.toString = function () {
        return this.isSuccess ? "Success(" + this.get() + "})" : "Failure(" + this.getError() + "})";
    };
    TryImpl.prototype.get = function () { throw 'impl child'; };
    TryImpl.prototype.getError = function () { throw 'impl child'; };
    TryImpl.prototype.flatMap = function (f) { throw 'impl child'; };
    TryImpl.prototype.map = function (f) { throw 'impl child'; };
    TryImpl.prototype.filter = function (f) { throw 'impl child'; };
    TryImpl.prototype.toOptional = function () { throw 'impl child'; };
    TryImpl.prototype.failed = function () { throw 'impl child'; };
    TryImpl.prototype.recover = function (f) { throw 'impl child'; };
    TryImpl.prototype.recoverWith = function (f) { throw 'impl child'; };
    TryImpl.prototype.fold = function (fe, ff) {
        return this.isFailure ? fe(this.getError()) : ff(this.get());
    };
    TryImpl.prototype.getOrElse = function (a) {
        return this.isFailure ? a : this.get();
    };
    TryImpl.prototype.orElse = function (a) {
        return this.isFailure ? a : this;
    };
    TryImpl.prototype.foreach = function (f) {
        if (this.isSuccess) {
            f(this.get());
        }
    };
    TryImpl.prototype.transform = function (fs, ff) {
        try {
            return this.isSuccess ? fs(this.get()) : ff(this.getError());
        }
        catch (e) {
            return Failure(e);
        }
    };
    TryImpl.prototype.apply1 = function (ob, f) {
        return this.flatMap(function (a) { return ob.map(function (b) { return f(a, b); }); });
    };
    TryImpl.prototype.apply2 = function (ob, oc, f) {
        return this.flatMap(function (a) { return ob.flatMap(function (b) { return oc.map(function (c) { return f(a, b, c); }); }); });
    };
    TryImpl.prototype.chain = function (ob) {
        return new TryBuilder1(this, ob);
    };
    return TryImpl;
})();
var SuccessImpl = (function (_super) {
    __extends(SuccessImpl, _super);
    function SuccessImpl(value) {
        _super.call(this);
        this.value = value;
        this.isSuccess = true;
        this.isFailure = false;
    }
    SuccessImpl.prototype.get = function () {
        return this.value;
    };
    SuccessImpl.prototype.getError = function () {
        throw 'Success has not Error';
    };
    SuccessImpl.prototype.flatMap = function (f) {
        try {
            return f(this.value);
        }
        catch (e) {
            return Failure(e);
        }
    };
    SuccessImpl.prototype.map = function (f) {
        var _this = this;
        return Try(function () { return f(_this.value); });
    };
    SuccessImpl.prototype.filter = function (f) {
        if (this.isSuccess) {
            try {
                return f(this.value) ? this : Failure(new Error('Predicate does not hold for ' + this.value));
            }
            catch (e) {
                return Failure(e);
            }
        }
    };
    SuccessImpl.prototype.toOptional = function () {
        return Optional_1.Optional(this.value);
    };
    SuccessImpl.prototype.failed = function () {
        return Failure(new Error('Success.failed'));
    };
    SuccessImpl.prototype.recover = function (f) {
        return Success(this.value);
    };
    SuccessImpl.prototype.recoverWith = function (f) {
        return Success(this.value);
    };
    SuccessImpl.prototype.toString = function () {
        return 'Success(' + this.value + ')';
    };
    return SuccessImpl;
})(TryImpl);
var FailureImpl = (function (_super) {
    __extends(FailureImpl, _super);
    function FailureImpl(e) {
        _super.call(this);
        this.e = e;
        this.isSuccess = false;
        this.isFailure = true;
    }
    FailureImpl.prototype.get = function () {
        throw this.e;
    };
    FailureImpl.prototype.getError = function () {
        return this.e;
    };
    FailureImpl.prototype.flatMap = function (f) {
        return Failure(this.e);
    };
    FailureImpl.prototype.map = function (f) {
        return new FailureImpl(this.e);
    };
    FailureImpl.prototype.filter = function (f) {
        return this;
    };
    FailureImpl.prototype.toOptional = function () {
        return Optional_1.None;
    };
    FailureImpl.prototype.failed = function () {
        return this;
    };
    FailureImpl.prototype.recover = function (f) {
        try {
            var op = f(this.e);
            return op.nonEmpty ? Success(op.get()) : Failure(this.e);
        }
        catch (e) {
            return Failure(e);
        }
    };
    FailureImpl.prototype.recoverWith = function (f) {
        try {
            var op = f(this.e);
            return op.nonEmpty ? op.get() : Failure(this.e);
        }
        catch (e) {
            return Failure(e);
        }
    };
    return FailureImpl;
})(TryImpl);
/**
 * TryBuilder.
 */
var TryBuilder1 = (function () {
    function TryBuilder1(oa, ob) {
        this.oa = oa;
        this.ob = ob;
    }
    TryBuilder1.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.map(function (b) { return f(a, b); }); });
    };
    TryBuilder1.prototype.chain = function (oc) {
        return new TryBuilder2(this.oa, this.ob, oc);
    };
    return TryBuilder1;
})();
exports.TryBuilder1 = TryBuilder1;
var TryBuilder2 = (function () {
    function TryBuilder2(oa, ob, oc) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
    }
    TryBuilder2.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.map(function (c) { return f(a, b, c); }); }); });
    };
    TryBuilder2.prototype.chain = function (od) {
        return new TryBuilder3(this.oa, this.ob, this.oc, od);
    };
    return TryBuilder2;
})();
exports.TryBuilder2 = TryBuilder2;
var TryBuilder3 = (function () {
    function TryBuilder3(oa, ob, oc, od) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
    }
    TryBuilder3.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) {
            return _this.od.map(function (d) { return f(a, b, c, d); });
        }); }); });
    };
    TryBuilder3.prototype.chain = function (oe) {
        return new TryBuilder4(this.oa, this.ob, this.oc, this.od, oe);
    };
    return TryBuilder3;
})();
exports.TryBuilder3 = TryBuilder3;
var TryBuilder4 = (function () {
    function TryBuilder4(oa, ob, oc, od, oe) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
        this.oe = oe;
    }
    TryBuilder4.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) { return _this.od.flatMap(function (d) {
            return _this.oe.map(function (e) { return f(a, b, c, d, e); });
        }); }); }); });
    };
    TryBuilder4.prototype.chain = function (of) {
        return new TryBuilder5(this.oa, this.ob, this.oc, this.od, this.oe, of);
    };
    return TryBuilder4;
})();
exports.TryBuilder4 = TryBuilder4;
var TryBuilder5 = (function () {
    function TryBuilder5(oa, ob, oc, od, oe, of) {
        this.oa = oa;
        this.ob = ob;
        this.oc = oc;
        this.od = od;
        this.oe = oe;
        this.of = of;
    }
    TryBuilder5.prototype.run = function (f) {
        var _this = this;
        return this.oa.flatMap(function (a) { return _this.ob.flatMap(function (b) { return _this.oc.flatMap(function (c) { return _this.od.flatMap(function (d) { return _this.oe.flatMap(function (e) {
            return _this.of.map(function (ff) { return f(a, b, c, d, e, ff); });
        }); }); }); }); });
    };
    return TryBuilder5;
})();
exports.TryBuilder5 = TryBuilder5;

},{"./Optional":3}],5:[function(require,module,exports){
var Optional_1 = require('./Optional');
var Either = require('./Either');
var Try_1 = require('./Try');
var Future_1 = require('./Future');
var scalike = {
    Optional: Optional_1.Optional,
    Some: Optional_1.Some,
    None: Optional_1.None,
    Right: Either.Right,
    Left: Either.Left,
    Try: Try_1.Try,
    Success: Try_1.Success,
    Failure: Try_1.Failure,
    Future: Future_1.Future
};
module.exports = scalike;

},{"./Either":1,"./Future":2,"./Optional":3,"./Try":4}]},{},[5])(5)
});