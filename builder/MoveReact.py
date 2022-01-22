import os, shutil, sys

sep = os.sep
flask_dir_name = "flask"
original_location        = ".."+sep+"build"+sep
original_css_location    = ".."+sep+"build"+sep+"static"+sep+"css"+sep
original_js_location     = ".."+sep+"build"+sep+"static"+sep+"js"+sep
original_media_location  = ".."+sep+"build"+sep+"static"+sep+"media"+sep
target_location_template = ".."+sep+flask_dir_name+sep+"templates"+sep+"react"+sep
target_location_template_statics = ".."+sep+flask_dir_name+sep+"static"+sep+"react"+sep+"template"+sep
target_location_static = ".."+sep+flask_dir_name+sep+"static"+sep+"react"+sep

dirs = [
    target_location_template,
    target_location_template_statics,
    target_location_static,
    target_location_static+"css"+sep,
    target_location_static+"js"+sep,
    target_location_static+"media"+sep
]


for d in dirs:
    if not os.path.exists(d):
        os.mkdir(d)

def move(original, target_loc):
    print("Moving", original, "to", target_loc)
    shutil.copyfile(original, target_loc)

def move_root_file(file_name, from_dir, to_dir):
    with open(from_dir+file_name, "r") as file:
        file_contents = file.read()

    new_file_contents = ""
    index = 0
    max_index = len(file_contents)

    while index < max_index:
        changed = False
        for dir_change in dir_changes:
            original_dir = dir_change[0]
            new_dir = dir_change[1]

            if not changed:

                if file_contents[index:index+len(original_dir)] == original_dir:
                    new_file_contents += new_dir
                    changed = True
                    index += len(original_dir)
        if not changed:
            new_file_contents += file_contents[index]

            index += 1

    with open(to_dir + file_name, "w") as file:
        file.write(new_file_contents)

dir_changes = [
    ["static/css", "static/react/css"],
    ["static/js", "static/react/js"],
    ["static/media", "static/react/media"]
]

moves = {"index.html": False, "manifest.json": False, "asset-manifest.json": False}

for bit in os.listdir(original_location):
    if not os.path.isdir(original_location+bit):
        if bit in moves.keys():
            moves[bit] = True
            print(bit, moves[bit])
        else:
            move(original_location+bit, target_location_template_statics+bit)
        if bit != "index.html":
            dir_changes.append([bit, "static/react/template/"+bit])

for css_file in os.listdir(original_css_location):
    if css_file.endswith(".css"):
        move(original_css_location+css_file, target_location_static+"css"+sep+css_file)

for media_file in os.listdir(original_media_location):
    move(original_media_location+media_file, target_location_static+"media"+sep+media_file)

print(dir_changes)

for js_file in os.listdir(original_js_location):
    if js_file.endswith(".js"):
        with open(original_js_location+js_file, "r") as file:
            file_contents = file.read()

        new_file_contents = ""
        index = 0
        max_index = len(file_contents)

        while index < max_index:
            changed = False
            for dir_change in dir_changes:
                original_dir = dir_change[0]
                new_dir = dir_change[1]

                if not changed:

                    if file_contents[index:index+len(original_dir)] == original_dir:
                        new_file_contents += new_dir
                        changed = True
                        index += len(original_dir)
            if not changed:
                new_file_contents += file_contents[index]

                index += 1

        with open(target_location_static+"js"+sep+js_file, "w") as file:
            file.write(new_file_contents)

        print("Changed", js_file)

move_root_file("index.html", original_location, target_location_template)
move_root_file("manifest.json", original_location, target_location_template_statics)



