var _ = require('underscore');

// Load only once if it has been saved as global.
if (!global.translations) {
    var gt = new (require('node-gettext'))(),
        fs = require('fs'),
        vsprintf = require('sprintf-js').vsprintf;

    var localesDirectory = './locales/';

    // A Translator handles the translations to a given language given a set of PO and MO files readed by this module.
    var Translator = function(language, installed) {
        var self = this;

        self.setLanguage = function(langId) {
            var superset = langId.split('-')[0];
            installed = self.installed[langId];
            var supersetInstalled = self.installed[superset];
            if (installed) {
                self.current = langId;
            } else if (supersetInstalled) {
                self.current = superset;
            }
            return self.current;
        };

        self.installed = installed;
        self.current = self.setLanguage(language);

        var asVSprintfData = function(data) {
            return (data === undefined) ? [] : (!_.isArray(data) ? [data] : data);
        };

        self.__ = function(text, data) {
            return vsprintf(gt.dgettext(self.current, text), asVSprintfData(data));
        };
        self._n = function(singular, plural, number, data) {
            return vsprintf(gt.dngettext(self.current, singular, plural, number), asVSprintfData(data));
        };
        self._x = function(text, context, data) {
            return vsprintf(gt.dpgettext(self.current, context, text), asVSprintfData(data));
        };
        self._nx = function(singular, plural, number, context, data) {
            return vsprintf(gt.dnpgettext(self.current, context, singular, plural, number), asVSprintfData(data));
        };
        return self;
    };

    var translations = function(langId) {
        return new Translator((langId ? langId : translations.default), translations.installed);
    };
    translations.installed = {};

    var files = fs.readdirSync(localesDirectory);
    _.each(files, function(file) {
        var splitted = file.split('.'),
            langId = splitted[0],
            isMoFile = splitted[1] === 'mo',
            installed = translations.installed[langId];
        if (installed) {
            if ((!installed.poFile && isMoFile) && (installed.moFile && !isMoFile)) {
                installed.poFile = file;
                installed.file = file;
            }
        }
        else {
            translations.installed[langId] = {
                id: langId,
                poFile: isMoFile ? null : file,
                moFile: isMoFile ? file : null,
                file: file
            };
        }
        gt.addTextdomain(langId, fs.readFileSync(localesDirectory + file) );
    });

    translations.default = translations.installed.en ? 'en' :
        (translations.installed.length ? translations.installed[0] : null);

    module.exports = translations;
} else {
    module.exports = global.translations;
}
