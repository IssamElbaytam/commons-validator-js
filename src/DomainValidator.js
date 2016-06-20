"use strict"

import * as Domains from "./Domains"
import _ from 'lodash'
import * as punycode from 'punycode'

export class DomainValidator {
	constructor() {
		const domainLabelRegex = "[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?"
		const topLabelRegex = "[a-zA-Z](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?"
		const domainNameRegex = "^(?:" + domainLabelRegex + "\\.)*(" + topLabelRegex + ")\\.?$"
		this._domainRegex = new RegExp(domainNameRegex)
	}
	_chompLeadingDot(str) {
		if (str[0] === ".") {
			return str.substring(1)
		}
		return str
	}
	_unicodeToASCII(input) {
		return punycode.toASCII(input);
	}
	_arrayContains(sortedArray, key) {
		// TODO: use binary search
		return _.includes(sortedArray, key)
	}
	isValidCountryCodeTld(ccTld) {
		const key = this._chompLeadingDot(this._unicodeToASCII(ccTld).toLowerCase())
		return this._arrayContains(Domains.countryCodeTlds, key)
	}
	isValidGenericTld(gTld) {
		const key = this._chompLeadingDot(this._unicodeToASCII(gTld).toLowerCase())
		return this._arrayContains(Domains.genericTlds, key)
	}
	isValidInfrastructureTld(iTld) {
		const key = this._chompLeadingDot(this._unicodeToASCII(iTld).toLowerCase())
		return this._arrayContains(Domains.infrastructureTlds, key)
	}
	isValidTld(tld) {
		tld = this._unicodeToASCII(tld)
		return this.isValidInfrastructureTld(tld) || this.isValidGenericTld(tld) || this.isValidCountryCodeTld(tld)
	}
	extractTld(domain) {
		if (!domain) {
			return false
		}
		
		domain = this._unicodeToASCII(domain)
		if (domain.length > 253) {
			return false
		}
		const groups = domain.match(this._domainRegex)
		if (groups) {
			return groups[1]
		}
		return null
	}
	isValid(domain) {
		const tld = this.extractTld(domain)
		if (!tld) {
			return null
		}
		return this.isValidTld(tld)
	}
}
