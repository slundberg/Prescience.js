import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {CptCodes} from './cpt-codes';
import d3 from 'd3';
import $ from 'bootstrap';
import moment from 'moment';
import {App} from "./app"

@inject(HttpClient, CptCodes, App)
export class Dashboard {
	width = window.innerWidth;
	procId = "MLORB_0543310";

	genderMap = {
    	"F": "Female",
    	"M": "Male"
    };

	groups = [
		{
			type: "series",
			label: "CCO",
			units: "L/min",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time"
			},
			tracks: [
				{ sensor: "CCO", label: "CCO", valueField: "numericValue", symbol: "circle" }
			]
		},
		{
			type: "series",
			label: "Heart rate",
			units: "beats per min.",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "ECGRATE", label: "ECG rate", valueField: "numericValue", symbol: "circle" },
				{ sensor: "PULSE", label: "Pulse", valueField: "numericValue", symbol: "square" }
			]
		},
		{
			type: "series",
			label: "Non-invasive BP",
			units: "mmHg",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "NIBPS", label: "Systolic", valueField: "numericValue", symbol: "triangle-down" },
				{ sensor: "NIBPM", label: "Mean", valueField: "numericValue", symbol: "square" },
				{ sensor: "NIBPD", label: "Diastolic", valueField: "numericValue", symbol: "triangle-up" }
			]
		},
		{
			type: "series",
			label: "Arterial BP",
			units: "mmHg",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "ABPS1", label: "Systolic", valueField: "numericValue", symbol: "triangle-down" },
				{ sensor: "ABPM1", label: "Mean", valueField: "numericValue", symbol: "square" },
				{ sensor: "ABPD1", label: "Diastolic", valueField: "numericValue", symbol: "triangle-up" }
			]
		},
		{
			type: "series",
			label: "Arterial BP 2",
			units: "mmHg",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "ABPS2", label: "Systolic", valueField: "numericValue", symbol: "triangle-down" },
				{ sensor: "ABPM2", label: "Mean", valueField: "numericValue", symbol: "square" },
				{ sensor: "ABPD2", label: "Diastolic", valueField: "numericValue", symbol: "triangle-up" }
			]
		},
		{
			type: "series",
			label: "Pulmonary artery BP",
			units: "mmHg",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "PAS", label: "Systolic", valueField: "numericValue", symbol: "triangle-down" },
				{ sensor: "PAM", label: "Mean", valueField: "numericValue", symbol: "square" },
				{ sensor: "PAD", label: "Diastolic", valueField: "numericValue", symbol: "triangle-up" }
			]
		},
		{
			type: "series",
			label: "CVP",
			units: "mmHg",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "CVP", label: "CVP", valueField: "numericValue", symbol: "circle" }
			]
		},
		{
			type: "series",
			label: "Blood saturation",
			units: "%",
			color: "#a80808",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "SAO2", label: "SaO2", valueField: "numericValue", symbol: "circle" },
				{ sensor: "SVO2", label: "SvO2", valueField: "numericValue", symbol: "square" }
			]
		},
		{
			type: "series",
			label: "Inspired conc.",
			units: "%",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "FIO2", label: "FiO2", valueField: "numericValue", symbol: "circle" },
				{ sensor: "FINO", label: "FiNO", valueField: "numericValue", symbol: "square" }
			]
		},
		{
			type: "series",
			label: "End-tidal pressure",
			units: "mmHg",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "ETCO2", label: "End-tidal CO2", valueField: "numericValue", symbol: "circle" },
			]
		},
		{
			type: "series",
			label: "End-tidal conc.",
			units: "%",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
		        { sensor: "ETSEV", label: "Sevoflurane'", valueField: "numericValue", symbol: "circle" },
		        { sensor: "ETSEVO", label: "Sevoflurane", valueField: "numericValue", symbol: "triangle-down" },
		        { sensor: "ETISO", label: "Isoflurane", valueField: "numericValue", symbol: "square" },
		        { sensor: "ETDES", label: "Desflurane", valueField: "numericValue", symbol: "diamond" },
		        { sensor: "ETHAL", label: "Halothane", valueField: "numericValue", symbol: "cross" }
			]
		},
		{
			type: "series",
			label: "Air pressure",
			units: "cm H2O",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "PEAK", label: "Peak pressure setting", valueField: "numericValue", symbol: "circle" },
				{ sensor: "PEAKPRESSURE", label: "Peak pressure setting", valueField: "numericValue", symbol: "square" },
				{ sensor: "PEEP", label: "PEEP", valueField: "numericValue", symbol: "diamond" },
				{ sensor: "PIP", label: "PIP", valueField: "numericValue", symbol: "triangle-down" }
			]
		},
		{
			type: "series",
			label: "Respiration rate",
			units: "breaths per min.",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "RESPRATE", label: "Respiration rate", valueField: "numericValue", symbol: "circle" },
				{ sensor: "RATE", label: "Rate", valueField: "numericValue", symbol: "diamond" }
			]
		},
		{
			type: "series",
			label: "Air flow",
			units: "L/min",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "AIRFLOW", label: "Air flow", valueField: "numericValue", symbol: "circle" },
				{ sensor: "O2FLOW", label: "O2 flow", valueField: "numericValue", symbol: "square" },
				{ sensor: "N2OFLOW", label: "N2O flow", valueField: "numericValue", symbol: "diamond" }
			]
		},
		{
			type: "series",
			label: "Air volume",
			units: "liters",
			color: "#1b71f1",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "TIDALVOLUME", label: "Tidal volume", valueField: "numericValue", symbol: "circle" },
				{ sensor: "TV", label: "Tidal volume", valueField: "numericValue", symbol: "square" }
			]
		},
		{
			type: "series",
			label: "Bispectral index",
			units: "unitless",
			color: "#db8b00",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "BIS", label: "Index", valueField: "numericValue", symbol: "circle" }
			]
		},
		{
			type: "series",
			label: "Electromyography",
			units: "unitless",
			color: "#db8b00",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "EMG", label: "EMG", valueField: "numericValue", symbol: "circle" }
			]
		},
		{
			type: "series",
			label: "IC pressure",
			units: "mmHg",
			color: "#db8b00",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "ICP", label: "pressure", valueField: "numericValue", symbol: "circle" }
			]
		},
		{
			type: "series",
			label: "Temperature",
			units: "degrees Celsius",
			color: "#db8b00",
			trackDefaults: {
				type: "monitor",
				timeField: "time",
			},
			tracks: [
				{ sensor: "TEMP1", label: "Temp. 1", valueField: "numericValue", symbol: "circle" },
				{ sensor: "TEMP2", label: "Temp. 2", valueField: "numericValue", symbol: "square" }
			]
		},
		{
			type: "dosage",
			color: "#ab4dce",
			trackDefaults: {
				type: "medication",
				timeField: "startTime",
				valueField: "value",
				sensorField: "name",
				unitsField: "units"
			},
			tracks: [
				{ sensor: "FENTANYL", label: "Fentanyl", units: "mcg" },
				{ sensor: "PROPOFOL", label: "Propofol", units: "mg" },
				{ sensor: "PHENYLEPHRINE", label: "Phenylephrine" },
				{ sensor: "HYDROMORPHONE", label: "Hydromorphone" },
				{ sensor: "CEFAZOLIN", label: "Cefazolin" },
				{ sensor: "MIDAZOLAM", label: "Midazolam" },
				{ sensor: "LIDOCAINE", label: "Lidocaine" },
				{ sensor: "EPHEDRINE", label: "Ephedrine" },
				{ sensor: "ROCURONIUM", label: "Rocuronium" },
				{ sensor: "ONDANSETRON", label: "Ondansetron" },
				{ sensor: "VECURONIUM", label: "Vecuronium" },
				{ sensor: "GLYCOPYRROLATE", label: "Glycopyrrolate" },
				{ sensor: "NEOSTIGMINE", label: "Neostigmine" },
				{ sensor: "DEXAMETHASONE", label: "Dexamethasone" },
				{ sensor: "VASOPRESSIN", label: "Vasopressin" },
				{ sensor: "SUCCINYLCHOLINE", label: "Succinylcholine" },
				{ sensor: "KETOROLAC", label: "Ketorolac" },
				{ sensor: "VANCOMYCIN", label: "Vancomycin" },
				{ sensor: "HEPARIN", label: "Heparin" },
				{ sensor: "CISATRACURIUM", label: "Cisatracurium" },
				{ sensor: "LABETALOL", label: "Labetalol" },
				{ sensor: "ESMOLOL", label: "Esmolol" },
				{ sensor: "CLINDAMYCIN", label: "Clindamycin" },
				{ sensor: "METOCLOPRAMIDE", label: "Metoclopramide" },
				{ sensor: "AMPICILLIN", label: "Ampicillin" },
				{ sensor: "METRONIDAZOLE", label: "Metronidazole" },
				{ sensor: "METOPROLOL", label: "Metoprolol" },
				{ sensor: "KETAMINE", label: "Ketamine" },
				{ sensor: "ETOMIDATE", label: "Etomidate" },
				{ sensor: "OXYTOCIN", label: "Oxytocin" },
				{ sensor: "REMIFENTANIL", label: "Remifentanil" },
				{ sensor: "RANITIDINE", label: "Ranitidine" },
				{ sensor: "PROTAMINE", label: "Protamine" },
				{ sensor: "MORPHINE", label: "Morphine" },
				{ sensor: "CIPROFLOXACIN", label: "Ciprofloxacin" },
				{ sensor: "ALBUTEROL", label: "Albuterol" },
				{ sensor: "LEVOFLOXACIN", label: "Levofloxacin" },
				{ sensor: "EPINEPHRINE", label: "Epinephrine" },
				{ sensor: "HYDROCORTISONE", label: "Hydrocortisone" },
				{ sensor: "SUFENTANIL", label: "Sufentanil" },
				{ sensor: "MANNITOL", label: "Mannitol" },
				{ sensor: "FUROSEMIDE", label: "Furosemide" },
				{ sensor: "CEFOTETAN", label: "Cefotetan" },
				{ sensor: "ATROPINE", label: "Atropine" },
				{ sensor: "GENTAMICIN", label: "Gentamicin" },
				{ sensor: "CEFTRIAXONE", label: "Ceftriaxone" },
				{ sensor: "METHYLPREDNISOLONE", label: "Methylprednisolone" },
				{ sensor: "METHADONE", label: "Methadone" },
				{ sensor: "BUPIVACAINE", label: "Bupivacaine" },
				{ sensor: "DIPHENHYDRAMINE", label: "Diphenhydramine" },
				{ sensor: "ACEBUTOLOL", label: "Acebutolol" },
				{ sensor: "ALFENTANIL", label: "Alfentanil" },
				{ sensor: "NITROGLYCERIN", label: "Nitroglycerin" },
				{ sensor: "GABAPENTIN", label: "Gabapentin" },
				{ sensor: "NICARDIPINE", label: "Nicardipine" },
				{ sensor: "PHENYTOIN", label: "Phenytoin" },
				{ sensor: "HYDRALAZINE", label: "Hydralazine" },
				{ sensor: "NOREPINEPHRINE", label: "Norepinephrine" },
				{ sensor: "DEXMEDETOMIDINE", label: "Dexmedetomidine" },
				{ sensor: "ACETAMINOPHEN", label: "Acetaminophen" },
				{ sensor: "NALOXONE", label: "Naloxone" },
				{ sensor: "DROPERIDOL", label: "Droperidol" },
				{ sensor: "DEXTROSE", label: "Dextrose" },
				{ sensor: "AMIODARONE", label: "Amiodarone" },
				{ sensor: "GLUCAGON", label: "Glucagon" },
				{ sensor: "LEVETIRACETAM", label: "Levetiracetam" },
				{ sensor: "MEPERIDINE", label: "Meperidine" },
				{ sensor: "MILRINONE", label: "Milrinone" },
				{ sensor: "ROPIVACAINE", label: "Ropivacaine" },
				{ sensor: "ACETAZOLAMIDE", label: "Acetazolamide" },
				{ sensor: "CEFUROXIME", label: "Cefuroxime" },
				{ sensor: "SCOPOLAMINE", label: "Scopolamine" },
				{ sensor: "FLUCONAZOLE", label: "Fluconazole" },
				{ sensor: "MEROPENEM", label: "Meropenem" },
				{ sensor: "BASILIXIMAB", label: "Basiliximab" },
				{ sensor: "CEFEPIME", label: "Cefepime" },
				{ sensor: "CELECOXIB", label: "Celecoxib" },
				{ sensor: "PANTOPRAZOLE", label: "Pantoprazole" },
				{ sensor: "METHYLERGONOVINE", label: "Methylergonovine" },
				{ sensor: "DESMOPRESSIN", label: "Desmopressin" },
				{ sensor: "AZTREONAM", label: "Aztreonam" },
				{ sensor: "CARBOPROST", label: "Carboprost" },
				{ sensor: "LINEZOLID", label: "Linezolid" },
				{ sensor: "ADENOSINE", label: "Adenosine" },
				{ sensor: "NAFCILLIN", label: "Nafcillin" },
				{ sensor: "ERTAPENEM", label: "Ertapenem" },
				{ sensor: "PHYTONADIONE", label: "Phytonadione" },
				{ sensor: "PROPRANOLOL", label: "Propranolol" },
				{ sensor: "FOSPHENYTOIN", label: "Fosphenytoin" },
				{ sensor: "MOXIFLOXACIN", label: "Moxifloxacin" },
				{ sensor: "PROMETHAZINE", label: "Promethazine" },
				{ sensor: "CLONIDINE", label: "Clonidine" },
				{ sensor: "METHOHEXITAL", label: "Methohexital" },
				{ sensor: "DILTIAZEM", label: "Diltiazem" },
				{ sensor: "FLUMAZENIL", label: "Flumazenil" },
				{ sensor: "CEFTAZIDIME", label: "Ceftazidime" },
				{ sensor: "OCTREOTIDE", label: "Octreotide" },
				{ sensor: "DOXYCYCLINE", label: "Doxycycline" },
				{ sensor: "MICAFUNGIN", label: "Micafungin" },
				{ sensor: "CEFOTAXIME", label: "Cefotaxime" },
				{ sensor: "COCAINE", label: "Cocaine" },
				{ sensor: "MEPIVACAINE", label: "Mepivacaine" },
				{ sensor: "NITROPRUSSIDE", label: "Nitroprusside" },
				{ sensor: "EDROPHONIUM", label: "Edrophonium" },
				{ sensor: "IPRATROPIUM", label: "Ipratropium" },
				{ sensor: "AZITHROMYCIN", label: "Azithromycin" },
				{ sensor: "DAPTOMYCIN", label: "Daptomycin" },
				{ sensor: "NALBUPHINE", label: "Nalbuphine" },
				{ sensor: "PANCURONIUM", label: "Pancuronium" },
				{ sensor: "TOBRAMYCIN", label: "Tobramycin" },
				{ sensor: "BIVALIRUDIN", label: "Bivalirudin" },
				{ sensor: "DIGOXIN", label: "Digoxin" },
				{ sensor: "AMIKACIN", label: "Amikacin" },
				{ sensor: "AMINOPHYLLINE", label: "Aminophylline" },
				{ sensor: "DOBUTAMINE", label: "Dobutamine" },
				{ sensor: "ERYTHROMYCIN", label: "Erythromycin" },
				{ sensor: "TIGECYCLINE", label: "Tigecycline" }
			]
		},
		{
			type: "dosage",
			color: "#db8b00",
			trackDefaults: {
				type: "fluid",
				timeField: "time",
				sensorField: "name",
				valueField: "value",
				unitsField: "units"
			},
			tracks: [
				{ sensor: "PLASMALYTE A (PH BALANCED)", label: "Plasmalyte A (pH balanced)" },
				{ sensor: "ESTIMATED BLOOD LOSS", label: "Estimated blood loss" },
				{ sensor: "URINE OUTPUT", label: "Urine output" },
				{ sensor: "LACTATED RINGERS", label: "Lactated ringers" },
				{ sensor: "SALINE 0.9%", label: "Saline 0.9%" },
				{ sensor: "PACKED RED BLOOD CELLS - HOMOLOGOUS", label: "Packed red blood cells - homologous" },
				{ sensor: "FRESH FROZEN PLASMA", label: "Fresh frozen plasma" },
				{ sensor: "SALVAGED BLOOD (CELLSAVER)", label: "Salvaged blood (cellsaver)" },
				{ sensor: "HETASTARCH", label: "HETASTARCH" },
				{ sensor: "PLATELETS", label: "PLATELETS" },
				{ sensor: "GASTRIC TUBE  ORO  NASO  OR GASTROSTOMY", label: "Gastric tube oro naso or gastrostomy" },
				{ sensor: "CEREBROSPINAL FLUID UNSPECIFIED SITE", label: "Cerebrospinal fluid unspecified site" },
				{ sensor: "MANNITOL", label: "Mannitol" },
				{ sensor: "CRYOPRECIPITATE", label: "CRYOPRECIPITATE" },
				{ sensor: "HYDROXYETHYL STARCH 6% IN LACTATED SOLUTION (HEXTEND)", label: "HYDROXYETHYL STARCH 6% IN LACTATED SOLUTION (HEXTEND)" },
				{ sensor: "DEXTROSE / WATER 5%", label: "DEXTROSE / WATER 5%" },
				{ sensor: "DEXTROSE / SALINE 5% / 0.9%", label: "DEXTROSE / SALINE 5% / 0.9%" },
				{ sensor: "OTHER - UNSPECIFIED ROUTE MEDICATION", label: "OTHER - UNSPECIFIED ROUTE MEDICATION" },
				{ sensor: "CHEST TUBE UNSPECIFIED TYPE", label: "CHEST TUBE UNSPECIFIED TYPE" },
				{ sensor: "DEXTROSE / SALINE 5% / 0.45%", label: "DEXTROSE / SALINE 5% / 0.45%" },
				{ sensor: "LIDOCAINE 1%", label: "LIDOCAINE 1%" },
				{ sensor: "DEXTROSE / LACTATED RINGERS 5%", label: "DEXTROSE / LACTATED RINGERS 5%" },
				{ sensor: "SODIUM BICARBONATE", label: "SODIUM BICARBONATE" },
				{ sensor: "ROPIVACAINE 0.2%", label: "ROPIVACAINE 0.2%" },
				{ sensor: "LIDOCAINE 2%", label: "LIDOCAINE 2%" },
				{ sensor: "DEXTRAN 40", label: "DEXTRAN 40" },
				{ sensor: "DEXMEDETOMIDINE,5", label: "DEXMEDETOMIDINE,5" },
				{ sensor: "DEXTROSE / WATER 10%", label: "DEXTROSE / WATER 10%" },
				{ sensor: "ROPIVACAINE 0.5%", label: "ROPIVACAINE 0.5%" },
				{ sensor: "DEXTROSE / SALINE 5% / 0.225%", label: "DEXTROSE / SALINE 5% / 0.225%" },
				{ sensor: "DEXTROSE / SALINE W/KCL 5% / 0.45% + 20 MEQ/L", label: "DEXTROSE / SALINE W/KCL 5% / 0.45% + 20 MEQ/L" },
				{ sensor: "DEXTROSE / SALINE W/KCL 5% / 0.9% + 20 MEQ/L", label: "DEXTROSE / SALINE W/KCL 5% / 0.9% + 20 MEQ/L" }
			]
		}
	];

	constructor(http, cptCodes, app) {
		this.http = http;
		this.dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S.%L");
		window.this10 = this;
		this.cptCodeMap = cptCodes.cptCodeMap;
		this.app = app;
		this.app.registerDashboard(this);
	    //this.userScoreColors = this.userScores.map(x => {value: x, color: ramp(x)});
		//r = new RegExp("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9].000")
		// this.http.get("data/merged.validation.subsample5050.doctortest.realtime.json").then(response => {
		//
		//
		// 	this.data = response.content[2];
		// 	this.replaceDates(this.data);
		// 	// parse all the dates in this procedure
		// 	// for (let key of ["monitor", "medication", "fluid"]) {
		// 	// 	for (let dataType in this.data[key]) {
		// 	// 		for (let d of this.data[key][dataType]) {
		// 	// 			d[0] = this.dateFormat.parse(d[0]);
		// 	// 		}
		// 	// 	}
		// 	// }
		// 	// d[0] = this.dateFormat.parse(d[0]);
		// 	console.log(response.content);
		// });
		// window.http3 = this.http;createRequest()
		// 	.withHeader("Authorization", "Basic "+btoa("admin:PASS"))
		// 	.asGet()
		// 	.send



		this.displayedGroups = [];
		window.groups3 = this.groups;

		this.colors = ["color: #f00", "color: #0f0", "color: #00f"];
	}

	attached() {
		window.addEventListener('resize', this.onWindowResize);

		this.http.get("/db/prescience/_search?size=50000&q=procId:"+this.procId).then(response => {

			// convert all the time fields to date objects
			for (let hit of response.content.hits.hits) {
				for (let key in hit._source) {
					if (typeof(hit._source[key]) === "string") {
						var t = this.dateFormat.parse(hit._source[key]);
						if (t !== null) hit._source[key] = t;
					}
				}
			}

			// get the summary info then set our inital time viewing window
			this.summaryInfo = response.content.hits.hits.find(x => x._source.type == "summaryinfo")._source;
			this.currentTime = this.summaryInfo.anesthesiaReadyTime;
			this.xaxis.domain([moment(this.currentTime).subtract(70, "minutes").toDate(), moment(this.currentTime).add(10, "minutes").toDate()]);
			console.log([moment(this.currentTime).subtract(70, "minutes").toDate(), moment(this.currentTime).add(10, "minutes").toDate()])

			this.response = response;
			this.drawPast();
			console.log("reponse", response.content);
		}).catch(x => {
			console.log("error", x);
		});
		window.groups3 = this.groups;
	}

	drawPast() {

		// get the summary, preop, and lab info then set our inital time viewing window
		this.orcaPreop = this.response.content.hits.hits
			.filter(x => x._source.type == "orcapreop")
			.filter(x => x._source.time <= this.currentTime)
			.map(x => x._source);
		this.labTests = this.response.content.hits.hits
			.filter(x => x._source.type == "lab")
			.filter(x => x._source.time <= this.currentTime)
			.map(x => x._source);

		// pull out the dates we want to show as events
		this.procEvents = [
			[this.summaryInfo.procStartTime, "Procedure start"],
			[this.summaryInfo.anesthesiaStartTime, "Anesthesia start"],
			[this.summaryInfo.anesthesiaReadyTime, "Anesthesia ready"],
			[this.summaryInfo.anesthesiaEndTime, "Anesthesia end"],
			[this.summaryInfo.inRoomTime, "In room"],
			[this.summaryInfo.leaveOrTime, "Leave OR"],
			[this.currentTime, "Now"]
		].filter(x => x[0] <= this.currentTime).sort();

		var trackDefaults = {
			timeField: "time",
			valueField: "value",
			unitsField: "units",
			sensorField: "sensor"
		};

		// load all the data into the groups
		this.displayedGroups = [];
		for (let group of this.groups) {
			for (let track of group.tracks) {
				var trackMerged = $.extend({}, trackDefaults, group.trackDefaults, track);
				//var type = track.type !== undefined ? track.type : group.trackDefaults.type;
				//var timeField = track.timeField !== undefined ? track.timeField : group.trackDefaults.timeField;
				//var valueFields = track.valueFields !== undefined ? track.valueFields : group.trackDefaults.valueFields;
				track.data = this.response.content.hits.hits
					.filter(x => x._source.type === trackMerged.type && x._source[trackMerged.sensorField] === track.sensor);

				if (group.type === "series") {
					track.data = track.data.map(x => [
						x._source[trackMerged.timeField],
						x._source[trackMerged.valueField]
					]).filter(x => x[0] <= this.currentTime).sort();

				} else if (group.type === "dosage") {
					track.data = track.data.map(x => [
						x._source[trackMerged.timeField],
						x._source[trackMerged.valueField],
						x._source[trackMerged.unitsField]
					]).filter(x => x[0] <= this.currentTime).sort();

				} else if (group.type === "bar-area") {
					track.data = track.data.map(x => [
						x._source[trackMerged.timeField],
						x._source[trackMerged.valueField]
					]).filter(x => x[0] <= this.currentTime).sort();
				}
				if (track.data.length > 0) group.hasData = true;
			}
			if (group.hasData) this.displayedGroups.push(group);
		}
	}

	advanceTime(minutes) {
		this.currentTime = moment(this.currentTime).add(minutes, "minutes").toDate();
		this.xaxis.domain([moment(this.currentTime).subtract(70, "minutes").toDate(), moment(this.currentTime).add(10, "minutes").toDate()]);
		//this.xaxis.domain(this.xaxis.domain().map(d => moment(d).add(minutes, "minutes").toDate()));
		//if (this.xaxis.domain()[1] < this.currentTime) this.xaxis.domain([this.xaxis.domain()[0], this.currentTime]);
		this.drawPast();
	}

	detached() {
		window.removeEventListener('resize', this.onWindowResize);
	}

	get fullName() {
		return `${this.firstName} ${this.lastName}`;
	}

	onWindowResize() {
		this.width = window.innerWidth;
	}

	// recursively replace all string dates in the object with data objects
	replaceDates(obj) {
		for (var key in obj) {
			if (typeof(obj[key]) === "string") {
				var date = this.dateFormat.parse(obj[key]);
				if (date !== null) obj[key] = date;
			} else if (typeof(obj[key]) === "object" || typeof(obj[key]) === "array") {
				this.replaceDates(obj[key]);
			}
		}
	}

	floor(x) {
		return Math.floor(x);
	}


	// removeNulls(obj) {
	// 	for (var key in obj) {
	// 		if (typeof(obj[key]) === "array") {
	// 			for (var i in obj[key]) {

	// 			}
	// 			var date = this.dateFormat.parse(obj[key]);
	// 			if (date !== null) obj[key] = date;
	// 		} else if (typeof(obj[key]) === "object" || typeof(obj[key]) === "array") {
	// 			this.replaceDates(obj[key]);
	// 		}
	// 	}
	// }
}
