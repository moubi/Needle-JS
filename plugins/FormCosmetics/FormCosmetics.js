NEEDLE.plug("FormCosmetics", function() {

FormCosmetics.ELEMENTS = ["radio", "select", "checkbox"];
FormCosmetics.CLASSES = {
	radio: {
		checked: "fc_radio fc_bg_bottom",
		unchecked: "fc_radio fc_bg_top"
	},
	select: {
		holder: "fc_select",
		left: "fc_select_left",
		right: "fc_select_right",
		ul: "fc_select_options",
		closed: "fc_hidden",
		opened: "fc_visible",
		choice: "fc_select_choice"
	},
	checkbox: {
		checked: "fc_checkbox fc_bg_bottom",
		unchecked: "fc_checkbox fc_bg_top"
	}
};
FormCosmetics.FORMS_CLASS = "cosmetics";

/**
 * @class FormCosmetics
 * TODO Having better way of setting a callback function.
 *
 */
function FormCosmetics(configuration) {
	this.FormCosmetics(configuration);
}

/**
 * @constructor FormCosmetics
 * @access public
 *
 * @param configuration Object (optional)
 *
 * @returns void
 */
FormCosmetics.prototype.FormCosmetics = function(configuration) {
	this.forms = [];
	this.formClass = configuration.formClass || FormCosmetics.FORMS_CLASS;
	this.elements = (!NEEDLE.isArray(configuration.elements)) ? FormCosmetics.ELEMENTS : configuration.elements;

	_init.call(this);
};

/**
 * @method checkbox
 * @access public
 *
 * @description Gets all checkboxes within a form element.
 *
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.checkbox = function(form) {
	if (typeof form.index != "undefined") {
		var checkboxes = NEEDLE.DOM.getElementsByAttribute("type", "checkbox", form, "input"), l = checkboxes.length, i;

		for (i = 0; i < l; i++) {
			this.setSingleCheckbox(checkboxes[i], form);
		}
	}
};

/**
 * @method radio
 * @access public
 *
 * @description Gets all radiobuttons within a form element.
 *
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.radio = function(form) {
	if (typeof form.index != "undefined") {
		var radios = NEEDLE.DOM.getElementsByAttribute("type", "radio", form, "input"), l = radios.length, i;

		for (i = 0; i < l; i++) {
			this.setSingleRadio(radios[i], form);
		}
	}
};

/**
 * @method select
 * @access public
 *
 * @description Gets all selects within a form element.
 *
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.select = function(form) {
	if (typeof form.index != "undefined") {
		var selects = form.getElementsByTagName("select"), l = selects.length, i;

		for (i = 0; i < l; i++) {
			// selects[0], because after the first select is deleted it affects selects array
			// it is ok with checkboxes and radios as they use array copy
			this.setSingleSelect(selects[0], form);
		}
	}
};

/**
 * @method setSingleCheckbox
 * @access public
 *
 * @description Replaces checkbox with a beauty version and imitate it.
 *
 * @param checkbox HTMLCheckboxElement (required)
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.setSingleCheckbox = function(checkbox, form) {
	if (typeof form != "undefined") {
		if (typeof form.index != "undefined") {
			var beautyVersion = _beautifyCheckbox(checkbox);

			_setElementIndex.call(this, beautyVersion, form, "checkbox");
			(beautyVersion.checked) && _imitateCheckbox(beautyVersion);
			_attachEventCheckbox(beautyVersion);
			NEEDLE.DOM.remove(checkbox);
		} else {
			form.index = this.forms.push(new _Collection(form)) - 1;
			this.setSingleCheckbox(checkbox, form);
		}
	}
};

/**
 * @method setSingleRadio
 * @access public
 *
 * @description Replaces radiobutton with a beauty version and imitate it.
 *
 * @param radio HTMLRadiobuttonElement (required)
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.setSingleRadio = function(radio, form) {
	if (typeof form != "undefined") {
		if (typeof form.index != "undefined") {
			var beautyVersion = _beautifyRadio(radio);

			_setElementIndex.call(this, beautyVersion, form, "radio");
			(beautyVersion.checked) && _imitateRadio(beautyVersion);
			_attachEventRadio.call(this, beautyVersion, form);
			NEEDLE.DOM.remove(radio);
		} else {
			form.index = this.forms.push(new _Collection(form)) - 1;
			this.setSingleRadio(radio, form);
		}
	}
};

/**
 * @method setSingleSelect
 * @access public
 *
 * @description Replaces selectbox with a beauty version and imitate it.
 *
 * @param select HTMLSelectElement (required)
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.setSingleSelect = function(select, form) {
	if (typeof form != "undefined") {
		if (typeof form.index != "undefined") {
			var beautyVersion = _beautifySelect(select),
				options = select.getElementsByTagName("option");

			_setElementIndex.call(this, beautyVersion, form, "select");
			if (options.length > 0) {
				NEEDLE.DOM.setStyle(beautyVersion, { zIndex : (beautyVersion.index + 1) });
				_beautifySelectOptions(beautyVersion, options);
				_imitateSelect(beautyVersion);
				_attachEventSelect(beautyVersion);
				_attachEventSelectOptions(beautyVersion);
			}
			NEEDLE.DOM.remove(select);
		} else {
			form.index = this.forms.push(new _Collection(form)) - 1;
			this.setSingleSelect(select, form);
		}
	}
};

/**
 * @method addForm
 * @access public
 *
 * @description Adds new form element to already beautified forms.
 *
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
FormCosmetics.prototype.addForm = function(form) {
	_setFormElements.call(this, NEEDLE.get(form));
};

/**
 * @method _init
 * @access private
 *
 * @description Initializes the plugin.
 *
 * @returns void
 */
function _init() {
	var forms = NEEDLE.DOM.getElementsByClassName(this.formClass, document, "form"), j = forms.length;

	while (j--) {
		_setFormElements.call(this, forms[j]);
	}
}

/**
 * @method _setFormElements
 * @access private
 *
 * @description Sets form elements in the plugins.
 *
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
function _setFormElements(form) {
	var i;
	form.index = this.forms.push(new _Collection(form)) - 1;

	for (i in this.elements) {
		(NEEDLE.inArray(this.elements[i], FormCosmetics.ELEMENTS)) && this[this.elements[i]](form);
	}
}

/**
 * @method _beautifyCheckbox
 * @access private
 *
 * @description Creates beautified version of the checkbox.
 *
 * @param checkbox HTMLCheckboxElement (required)
 *
 * @returns HTMLElement (beautified version)
 */
function _beautifyCheckbox(checkbox) {
	var beautyVersion = NEEDLE.DOM.createPlus("span", { "class" : FormCosmetics.CLASSES.checkbox[(checkbox.checked) ? "checked" : "unchecked"] });
	(checkbox.id) && (beautyVersion.id = checkbox.id);
	beautyVersion.checked = checkbox.checked;
	beautyVersion.name = checkbox.name;

	NEEDLE.DOM.insertBefore(beautyVersion, checkbox);
	return beautyVersion;
}

/**
 * @method _imitateCheckbox
 * @access private
 *
 * @description Creates hidden input field to imitate checkbox state.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _imitateCheckbox(beautyVersion) {
	beautyVersion.imitation = NEEDLE.DOM.createPlus("input", { type : "hidden", name : beautyVersion.name, value : "on" });
	NEEDLE.DOM.insertBefore(beautyVersion.imitation, beautyVersion);
}

/**
 * @method _attachEventCheckbox
 * @access private
 *
 * @description Attaches event listener function.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _attachEventCheckbox(beautyVersion) {
	beautyVersion.onclick = function() {
		if (this.checked) {
			this.className = FormCosmetics.CLASSES.checkbox.unchecked;
			NEEDLE.DOM.remove(this.imitation);
		} else {
			this.className = FormCosmetics.CLASSES.checkbox.checked;
			_imitateCheckbox(this);
		}
		this.checked = !this.checked;
		(typeof beautyVersion.callback === "function") && beautyVersion.callback();
	};
}

/**
 * @method _beautifyRadio
 * @access private
 *
 * @description Creates beautified version of the radiobutton.
 *
 * @param radio HTMLRadiobuttonElement (required)
 *
 * @returns HTMLElement (beautified version)
 */
function _beautifyRadio(radio) {
	var beautyVersion = NEEDLE.DOM.createPlus("span", { "class" : FormCosmetics.CLASSES.radio[(radio.checked) ? "checked" : "unchecked"] });
	(radio.id) && (beautyVersion.id = radio.id);
	beautyVersion.checked = radio.checked;
	beautyVersion.name = radio.name;
	beautyVersion.value = radio.value;

	NEEDLE.DOM.insertBefore(beautyVersion, radio);
	return beautyVersion;
}

/**
 * @method _imitateRadio
 * @access private
 *
 * @description Creates hidden input field to imitate radiobutton state.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _imitateRadio(beautyVersion) {
	beautyVersion.imitation = NEEDLE.DOM.createPlus("input", { type : "hidden", name : beautyVersion.name, value : beautyVersion.value });
	NEEDLE.DOM.insertBefore(beautyVersion.imitation, beautyVersion);
}

/**
 * @method _attachEventRadio
 * @access private
 *
 * @description Attaches event listener function.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _attachEventRadio(beautyVersion, form) {
	var that = this;
	beautyVersion.onclick = function() {
		if (!this.checked) {
			_unselectSelectedRadio.call(that, form, this.name);
			this.className = FormCosmetics.CLASSES.radio.checked;
			_imitateRadio(this);
		}
		this.checked = !this.checked;
		(typeof beautyVersion.callback === "function") && beautyVersion.callback();
	};
}

/**
 * @method _unselectSelectedRadio
 * @access private
 *
 * @description Unselects radiobuttons within same group.
 *
 * @param form HTMLFormElement (required)
 * @param groupName String (required)
 *
 * @returns void
 */
function _unselectSelectedRadio(form, groupName) {
	var radios = this.forms[form.index].elements.radio, i = radios.length;
	while (i--) {
		if (radios[i].name == groupName) {
			if (radios[i].checked) {
				radios[i].className = FormCosmetics.CLASSES.radio.unchecked;
				radios[i].checked = false;
				NEEDLE.DOM.remove(radios[i].imitation);
			}
		}
	}
}

/**
 * @method _beautifySelect
 * @access private
 *
 * @description Creates beautified version of the selectbox.
 *
 * @param select HTMLSelectElement (required)
 *
 * @returns HTMLElement (beautified version)
 */
function _beautifySelect(select) {
	var beautyVersion = NEEDLE.DOM.createPlus("span", { "class" : FormCosmetics.CLASSES.select.holder });

	beautyVersion.left = NEEDLE.DOM.createPlus("span", { "class" : FormCosmetics.CLASSES.select.left }),
	beautyVersion.right = NEEDLE.DOM.createPlus("span", { "class" : FormCosmetics.CLASSES.select.right }),
	beautyVersion.choice = NEEDLE.DOM.createPlus("span", { "class" : FormCosmetics.CLASSES.select.choice }),
	clear = NEEDLE.DOM.create("span");

	NEEDLE.DOM.setStyle(clear, { display : "block", clear : "both" });
	(select.id) && (beautyVersion.id = select.id);
	beautyVersion.selected = {value : null, text : null};
	beautyVersion.name = select.name;
	beautyVersion.options = [];
	beautyVersion.opened = false;

	NEEDLE.DOM.insertBefore(beautyVersion, select);
	NEEDLE.DOM.add(beautyVersion.left, beautyVersion);
	NEEDLE.DOM.add(beautyVersion.right, beautyVersion);
	NEEDLE.DOM.add(beautyVersion.choice, beautyVersion.right);
	NEEDLE.DOM.add(clear, beautyVersion);

	beautyVersion.style.width = select.offsetWidth + "px";
	beautyVersion.right.style.width = select.offsetWidth  - beautyVersion.left.offsetWidth + "px";

	return beautyVersion;
}

/**
 * @method _beautifySelectOptions
 * @access private
 *
 * @description Creates beautified version of the options within selectbox.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 * @param options Array (required)
 *
 * @returns void
 */
function _beautifySelectOptions(beautyVersion, options) {
	var length = options.length, i;

	beautyVersion.ul = NEEDLE.DOM.createPlus("ul", { "class" : FormCosmetics.CLASSES.select.ul + " " +  FormCosmetics.CLASSES.select.closed});
	beautyVersion.ul.li = [];
	beautyVersion.selected = {value : options[0].value, text : options[0].innerHTML};

	for (i = 0; i < length; i++) {
		beautyVersion.ul.li[i] = NEEDLE.DOM.create("li");
		beautyVersion.options[i] = NEEDLE.DOM.createPlus("a", { href : "javascript:void(0)", title : options[i].value });
		beautyVersion.options[i].value = options[i].value;
		beautyVersion.options[i].text = options[i].innerHTML;

		beautyVersion.options[i].innerHTML = options[i].innerHTML;
		NEEDLE.DOM.add(beautyVersion.options[i], beautyVersion.ul.li[i]);
		NEEDLE.DOM.add(beautyVersion.ul.li[i], beautyVersion.ul);

		if (options[i].selected) {
			beautyVersion.selected = { value : options[i].value, text : options[i].innerHTML };
		}
	}
	beautyVersion.choice.innerHTML = beautyVersion.selected.text;
	NEEDLE.DOM.add(beautyVersion.ul, beautyVersion);
}

/**
 * @method _imitateSelect
 * @access private
 *
 * @description Creates hidden input field to imitate selectbox state.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _imitateSelect(beautyVersion) {
	beautyVersion.imitation = NEEDLE.DOM.createPlus("input", { type : "hidden", name : beautyVersion.name, value : beautyVersion.selected.value });
	NEEDLE.DOM.insertBefore(beautyVersion.imitation, beautyVersion);
}

/**
 * @method _attachEventSelect
 * @access private
 *
 * @description Attaches event listener function.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _attachEventSelect(beautyVersion) {
	beautyVersion.right.onclick = function() {
		beautyVersion.ul.className = FormCosmetics.CLASSES.select.ul + " " + ((!beautyVersion.opened) ? FormCosmetics.CLASSES.select.opened : FormCosmetics.CLASSES.select.closed);
		beautyVersion.opened = !beautyVersion.opened;
	};
}

/**
 * @method _attachEventSelectOptions
 * @access private
 *
 * @description Attaches event listener function for option elements within selectbox.
 *
 * @param beautyVersion HTMLElement (beautified version) (required)
 *
 * @returns void
 */
function _attachEventSelectOptions(beautyVersion) {
	var i = beautyVersion.options.length;
	while (i--) {
		beautyVersion.options[i].onclick = function() {
			beautyVersion.selected = { value : this.value, text : this.text };
			beautyVersion.choice.innerHTML = beautyVersion.selected.text;
			beautyVersion.imitation.value = beautyVersion.selected.value;
			beautyVersion.right.onclick();
			(typeof beautyVersion.callback === "function") && beautyVersion.callback();
		};
	}
}

/**
 * @method _setElementIndex
 * @access private
 *
 * @description Sets element index.
 *
 * @param element HTMLElement (required)
 * @param form HTMLFormElement (required)
 * @param type String (required)
 *
 * @returns void
 */
function _setElementIndex(element, form, type) {
	element.index = this.forms[form.index].elements[type].push(element) - 1;
}

/**
 * @constructor _Collection
 * @access private
 *
 * @description Initializes form collection.
 *
 * @param form HTMLFormElement (required)
 *
 * @returns void
 */
function _Collection(form) {
	var i = FormCosmetics.ELEMENTS.length;
	this.form = form;
	this.elements = {};
	while (i--) { this.elements[FormCosmetics.ELEMENTS[i]] = []; }
}

return FormCosmetics;
});
