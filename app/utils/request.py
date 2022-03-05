from flask import request


def parse_args_list(arg):
    arr = []

    if request.args:
        arr = [] if request.args.get(
            arg) is None else request.args.get(arg).split(',')

    if len(arr) == 0:
        arr = None

    return arr

def parse_args_single(arg):
    arr = []

    if request.args:
        arr = [] if request.args.get(
            arg) is None else request.args.get(arg).split(',')

    if len(arr) == 0:
        arr = None

    return arr