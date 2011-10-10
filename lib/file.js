/**
 * 
 * @param name the name of the file
 * @param path the full path of the file
 * @param data the data of the file
 */
function File(name, path, data) {
    this.name = name;
    this.path = path;
    this.data = data;
}

module.exports = File;