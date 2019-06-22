const builder = (action, path, args = []) => {
    let thisArgs = args;
    const route = path.split('.');
    if (route.length !== 2) return new Error('malformed api call');
    const type = route[0];
    const command = route[1];
    if (!Array.isArray(thisArgs)) thisArgs = [thisArgs];
    return {
        type,
        action,
        command,
        args: thisArgs
    };
};

const api = {
    create: (path, args) => builder('create', path, args),
    read: (path, args) => builder('read', path, args),
    update: (path, args) => builder('update', path, args),
    delete: (path, args) => builder('delete', path, args)
};

module.exports = { api };
