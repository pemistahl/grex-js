/*
 * Copyright © 2022 Peter M. Stahl pemistahl@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import "./styles.css"
import LogoImage from "./logo.png"
import GitHubLogo from "./GitHub-Mark-120px-plus.png"

import m from "mithril"
import { RegExpBuilder } from "@pemistahl/grex"

const Logo = {
  view: vnode => m("img#logo.pure-img", {src: LogoImage})
}

const Heading = {
  view: vnode => m(
    "h1.pure-u-11-12", 
    "Generate a matching regular expression from the test cases you provide"
  )
}

const SubHeading = {
  view: vnode => m(
    "p.pure-u-11-12", 
      "Test cases are separated by a space.",
      m("br"),
      "Space characters to be included in the resulting expression have to be escaped with a single backslash."
  )
}

const CheckBoxEscape = createCheckBox(
  "checkbox-escape", 
  "Escape non-ASCII characters"
)

const CheckBoxRepetitions = createCheckBox(
  "checkbox-repetitions", 
  "Enable repetitions"
)

const CheckBoxVerboseMode = createCheckBox(
  "checkbox-verbose-mode", 
  "Enable verbose mode"
)

const CheckBoxIgnoreCase = createCheckBox(
  "checkbox-ignore-case", 
  "Case-insensitive matching"
)

const CheckBoxCapturingGroups = createCheckBox(
  "checkbox-capturing-groups", 
  "Enable capturing groups"
)

const CheckBoxAnchors = createCheckBox(
  "checkbox-anchors", 
  "Disable anchors"
)

const CheckBoxDigits = createCheckBox(
  "checkbox-digits", 
  "Convert digits to \\d"
)

const CheckBoxSpace = createCheckBox(
  "checkbox-space", 
  "Convert whitespace to \\s"
)

const CheckBoxWords = createCheckBox(
  "checkbox-words", 
  "Convert words to \\w"
)

const CheckBoxNonDigits = createCheckBox(
  "checkbox-non-digits", 
  "Convert non-digits to \\D"
)

const CheckBoxNonSpace = createCheckBox(
  "checkbox-non-space", 
  "Convert non-whitespace to \\S"
)

const CheckBoxNonWords = createCheckBox(
  "checkbox-non-words", 
  "Convert non-words to \\W"
)

const InputField = {
  value: () => document.getElementById("test-cases").value,
  view: vnode => m(
    "input#test-cases.pure-input-1[type=search][placeholder=Enter test cases here]",
    {oninput: vnode.attrs.callback}
  )
}

const TextArea = {
  alignCenter: () => document.getElementById("regexp").style.textAlign = "center",
  alignLeft: () => document.getElementById("regexp").style.textAlign = "left",
  onupdate: vnode => {
    vnode.dom.style.height = ""
    vnode.dom.style.height = `${vnode.dom.scrollHeight + 5}px`
  },
  view: vnode => m("textarea#regexp.pure-input-1[readonly]", vnode.children)
}

const FieldSet = {
  view: vnode => m("fieldset", vnode.attrs, vnode.children)
}

const Form = {
  view: vnode => m(
    "form.pure-u-11-12.pure-u-md-3-4.pure-form[autocomplete=off]", 
    {onsubmit: (event) => event.preventDefault()},
    vnode.children
  )
}

const Grid = {
  view: vnode => m("div.pure-g.centered", vnode.children)
}

const GridCell = {
  view: vnode => m(
    "div.pure-u-1.pure-u-lg-1-2.pure-u-xxl-1-3", 
    vnode.children
  )
}

const Footer = {
  view: vnode => m("footer",
    m("a[href=https://www.apache.org/licenses/LICENSE-2.0.txt][title=Read Apache License 2.0][target=_blank]", "Apache License 2.0"),
    " © ",
    m("a[href=https://github.com/pemistahl][title=Open Peter's GitHub profile][target=_blank]", "Peter M. Stahl"),
    m("br"),
    "Source Code on ",
    m("img#github-logo", {src: GitHubLogo}),
    " ",
    m("a[href=https://github.com/pemistahl/grex-js][title=Open GitHub repository of grex-js][target=_blank]",
      "GitHub")
  )
}

function createCheckBox(id, label) {
  return {
    isChecked: () => document.getElementById(id).checked,
    view: vnode => m("label.pure-checkbox", {for: id},
      m(
        "input[type=checkbox]",
        {id: id, onclick: vnode.attrs.callback}
      ),
      label
    )
  }
}

function createRegExp() {
  const input = InputField.value()
  
  // Safari does not yet support lookbehind
  // once it does, replace these lines with input.split(/(?<![^\\]?\\) /)
  let testCases = input.split("").reverse().join("").split(/ (?!\\[^\\]?)/)
    .map(s => s.split("").reverse().join(""))
    .reverse()
    .map(testCase => testCase.replaceAll("\\ ", " "))
    .flatMap(testCase => {
      if (!testCase.match(/ +/)) {
        return testCase.split(/ (.*)/s)
      } else {
        return testCase
      }
    })
    .filter(testCase => testCase.length > 0)
  
  if (testCases.length === 0) {
    return ""
  }
  
  let builder = RegExpBuilder.from(testCases)
  
  if (CheckBoxEscape.isChecked()) {
    builder = builder.withEscapingOfNonAsciiChars(false)
  }
  
  if (CheckBoxRepetitions.isChecked()) {
    builder = builder.withConversionOfRepetitions()
  }
  
  if (CheckBoxVerboseMode.isChecked()) {
    builder = builder.withVerboseMode()
    TextArea.alignLeft()
  } else {
    TextArea.alignCenter()
  }
  
  if (CheckBoxIgnoreCase.isChecked()) {
    builder = builder.withCaseInsensitiveMatching()
  }
  
  if (CheckBoxCapturingGroups.isChecked()) {
    builder = builder.withCapturingGroups()
  }
  
  if (CheckBoxAnchors.isChecked()) {
    builder = builder.withoutAnchors()
  }
  
  if (CheckBoxDigits.isChecked()) {
    builder = builder.withConversionOfDigits()
  }
  
  if (CheckBoxSpace.isChecked()) {
    builder = builder.withConversionOfWhitespace()
  }
  
  if (CheckBoxWords.isChecked()) {
    builder = builder.withConversionOfWords()
  }
  
  if (CheckBoxNonDigits.isChecked()) {
    builder = builder.withConversionOfNonDigits()
  }
  
  if (CheckBoxNonSpace.isChecked()) {
    builder = builder.withConversionOfNonWhitespace()
  }
  
  if (CheckBoxNonWords.isChecked()) {
    builder = builder.withConversionOfNonWords()
  }
  
  return builder.build()
}

function App(initialVnode) {
  let regexp = ""
  const handler = {callback: () => regexp = createRegExp()}
  
  return {
    view: vnode => m("div.container", 
      m("main",
        m(Grid,
          m(Logo),
          m(Heading),
          m(SubHeading),
          m(Form, [
            m(FieldSet, {class: "pure-group"}, [
              m(InputField, handler),
              m(TextArea, regexp)
            ]),
            m(FieldSet, [
              m(GridCell, m(CheckBoxEscape, handler)),
              m(GridCell, m(CheckBoxRepetitions, handler)),
              m(GridCell, m(CheckBoxVerboseMode, handler)),
              m(GridCell, m(CheckBoxIgnoreCase, handler)),
              m(GridCell, m(CheckBoxCapturingGroups, handler)),
              m(GridCell, m(CheckBoxAnchors, handler)),
              m(GridCell, m(CheckBoxDigits, handler)),
              m(GridCell, m(CheckBoxSpace, handler)),
              m(GridCell, m(CheckBoxWords, handler)),
              m(GridCell, m(CheckBoxNonDigits, handler)),
              m(GridCell, m(CheckBoxNonSpace, handler)),
              m(GridCell, m(CheckBoxNonWords, handler)),
            ])
          ]),
        )
      ),
      m(Footer)
    )
  }
}

m.mount(document.body, App)
