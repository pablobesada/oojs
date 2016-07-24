"use strict";

(function ($) {

    let _ = require('underscore')

    class TemplateManager {

        constructor() {
            this.selectors = {}
            this.underscoreTemplateArgs = {
                evaluate: /\{\{(.+?)\}\}/g,
                interpolate: /\{\{=(.+?)\}\}/g,
                escape: /\{\{-(.+?)\}\}/g
            }
        }

        get(selector) {
            let res = this.selectors[selector];
            if (!res) {
                let meta = TemplateManager.xml.find(selector)
                if (meta.length == 0) throw new Error(`Template for "${selector}" not found`)
                let template = _.template(meta.text(), this.underscoreTemplateArgs);
                this.selectors[selector] = {getHTML: template, meta: meta};
                //else throw new Error (`Template for "${selector}" not found`)
                res = this.selectors[selector];
            }
            return res;
        }

    }

    TemplateManager.xml = $($.parseXML(`
    <window>
        <tabs page-container-selector=".page-container"><![CDATA[
            <div class="row">
                <div class="col s12 page-container">
                    <ul class="tabs">
                        {{ _.each(tabs, function(tab) { }}
                            <li class="tab"><a href="#{{=tab.id}}">{{=tab.label}}</a></li>
                        {{ }); }}
                    </ul>
                </div>
            </div>
        ]]></tabs>
        <oomaster>
            <editors>
                <string class="string" editor-selector="input" pastewindow-opener-selector="i"><![CDATA[
                    <div class="input-field col s4">
                        {{ if (pastewindow) { }}
                            <i class="mdi prefix">search</i>
                        {{ } }}
                        <input id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="editor {{=cls}} validate"/>
                        <label for="{{=id}}">{{=label}}</label>
                    </div>
                ]]></string>
                <integer class="integer" editor-selector="input"><![CDATA[
                    <div class="input-field col s4">
                        <input id="{{=id}}" value="{{=value}}" type="number" name="{{=field}}" class="editor {{=cls}} validate"/>
                        <label for="{{=id}}">{{=label}}</label>
                    </div>
                ]]></integer>
                <checkbox class="checkbox" editor-selector="input"><![CDATA[
                    <p>
                        <input {{print(checked? 'checked="checked"': '')}} type="checkbox" name="{{=field}}" class="editor {{=cls}} validate" id="{{=id}}">
                        <label for="{{=id}}">{{=label}}</label>
                    </p>
                ]]></checkbox>
                <date class="date" editor-selector="input"><![CDATA[
                    <div class="input-field col s4">
                        <input id="{{=id}}" data-value="{{=value}}" type="date" name="{{=field}}" class="editor datepicker {{=cls}} validate" datepicker="true"/>
                        <label for="{{=id}}">{{=label}}</label>
                    </div>
                ]]></date>
                <time class="time" editor-selector="input" editor-init="$($editor[0]).mask('09:00:00');"><![CDATA[
                    <div class="input-field col s4">
                        <input id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="editor timeeditor {{=cls}} validate " timeeditor="true"/>
                        <label for="{{=id}}">{{=label}}</label>
                    </div>
                ]]></time>
                <combobox class="combobox" editor-selector="select"><![CDATA[
                    <div class="input-field col s4">
                        <select id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="editor {{=cls}} validate">
                        {{ _.each(options, function(option) { }}
                            <option value="{{=option.value}}"  {{print(option.selected?'selected':'')}}="">  {{=option.label}}</option>
                        {{ }); }}
                        </select>
                        <label for="{{=id}}">{{=label}}</label>
                    </div>
                ]]></combobox>
                <radiobutton class="radiobutton" editor-selector="input"><![CDATA[
                    {{ _.each(options, function(option) { }}
                        <p>
                            <input value="{{=option.value}}" type="radio" name="{{=option.field}}" class="editor {{=option.cls}} validate" id="{{=option.id}}">
                            <label for="{{=option.id}}">{{=option.label}}</label>
                        </p>
                    {{ }); }}
                ]]></radiobutton>
                <memo class="memo" editor-selector="textarea"><![CDATA[
                    <div class="input-field col s4">
                        <textarea id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="materialize-textarea editor {{=cls}} validate">
                        </textarea>
                        <label for="{{=id}}">{{=label}}</label>
                    </div>
                ]]></memo>
                <matrix row-container-selector="tbody"><![CDATA[
                    <table name="{{=field}}" class="bordered oodetail striped">
                        <thead>
                            <tr>
                                {{ _.each(columns, function(col) { }}
                                    <th>{{=col.label}}</th>
                                {{ }); }}
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                ]]></matrix>
                <matrixrow><![CDATA[
                    <tr rownr="{{=rowNr}}"></tr>
                ]]></matrixrow>
                <matrixcell><![CDATA[
                    <td></td>
                ]]></matrixcell>
            </editors>
        </oomaster>
        <oodetail>
            <editors>
                <string class="string" editor-selector="input" pastewindow-opener-selector="i"><![CDATA[
                    <div class="input-field" style="{{pastewindow? print('margin-left: 20px'): ''}}">
                        {{ if (pastewindow) { }}
                            <i class="mdi prefix" style="margin-left: -20px">search</i>
                        {{ } }}
                        <input id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="editor {{=cls}} validate"/>
                    </div>
                ]]></string>
                <integer class="integer" editor-selector="input"><![CDATA[
                    <input id="{{=id}}" value="{{=value}}" type="number" name="{{=field}}" class="editor {{=cls}} validate"/>
                ]]></integer>
                <date class="date" editor-selector="input"><![CDATA[
                    <input id="{{=id}}" data-value="{{=value}}" type="date" name="{{=field}}" class="editor datepicker {{=cls}} validate" datepicker="true"/>
                ]]></date>
                <time class="time" editor-selector="input" editor-init="$($editor[0]).mask('09:00:00');"><![CDATA[
                    <input id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="editor timeeditor {{=cls}} validate " timeeditor="true"/>
                ]]></time>
                <combobox class="combobox" editor-selector="select"><![CDATA[
                    <select id="{{=id}}" value="{{=value}}" type="text" name="{{=field}}" class="editor {{=cls}} validate">
                        {{ _.each(options, function(option) { }}
                            <option value="{{=option.value}}"  {{print(option.selected?'selected':'')}}="">  {{=option.label}}</option>
                        {{ }); }}
                    </select>
                ]]></combobox>
                <checkbox class="checkbox" editor-selector="input"><![CDATA[
                    <p>
                        <input  {{print(checked? 'checked="checked"': '')}} type="checkbox" name="{{=field}}" class="editor {{=cls}} validate" id="{{=id}}">
                        <label for="{{=id}}"></label>
                    </p>
                ]]></checkbox>
            </editors>
        </oodetail>
    </window>`));

    window.oo.ui.templates = new TemplateManager();
})(jQuery)