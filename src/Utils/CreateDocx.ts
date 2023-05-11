import * as moment from 'moment';

import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  HeightRule,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  VerticalAlign,
  WidthType,
} from 'docx';
import { AddReportDto } from 'src/services/clients/dto/AddReport-dto';

const CreateTableHeader = (text: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: 'Calibri',
        color: '#000000',
        bold: true,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.CENTER,
  });
};

const CreateTableCell = (text: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: 'Calibri',
        color: '#000000',
        bold: false,
      }),
    ],
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.CENTER,
  });
};

const CreateTableKey = (text: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: 'Calibri',
        color: '#5e5f6e',
        bold: true,
      }),
    ],
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
  });
};

const CreateTableValue = (text: string, TextAlignment?: AlignmentType) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: 'Calibri',
        color: '#9899a2',
        bold: false,
        italics: false,
      }),
    ],
    heading: HeadingLevel.HEADING_4,
    alignment: TextAlignment ? TextAlignment : AlignmentType.RIGHT,
  });
};

const CreateDocx = async (dto: AddReportDto, Reporter: string, CreatedAt: any) => {
  var AffectedPersonTable = [];
  dto.AffectedPerson.forEach((item) => {
    if (item.Name.length > 0) {
      AffectedPersonTable.push(
        new TableRow({
          height: { value: '0.4in', rule: HeightRule.EXACT },
          children: [
            new TableCell({
              children: [CreateTableValue(item.Name, AlignmentType.LEFT)],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 5000, type: WidthType.DXA },
              shading: {
                color: '#f8f8f9',
                type: ShadingType.SOLID,
                fill: '#f8f8f9',
              },
            }),
            new TableCell({
              children: [CreateTableValue(item.Contact, AlignmentType.LEFT)],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 5000, type: WidthType.DXA },
              shading: {
                color: '#f8f8f9',
                type: ShadingType.SOLID,
                fill: '#f8f8f9',
              },
            }),
          ],
        }),
      );
    }
  });

  var NotifiedPersonTable = [];
  dto.NotifiedPerson.forEach((element) => {
    if (element.Name.length > 0) {
      NotifiedPersonTable.push(
        new TableRow({
          height: { value: '0.4in', rule: HeightRule.EXACT },
          children: [
            new TableCell({
              children: [CreateTableValue(element.Name, AlignmentType.LEFT)],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 2500, type: WidthType.DXA },
              shading: {
                color: '#f8f8f9',
                type: ShadingType.SOLID,
                fill: '#f8f8f9',
              },
            }),
            new TableCell({
              children: [CreateTableValue(element.Role, AlignmentType.LEFT)],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 2500, type: WidthType.DXA },
              shading: {
                color: '#f8f8f9',
                type: ShadingType.SOLID,
                fill: '#f8f8f9',
              },
            }),
            new TableCell({
              children: [CreateTableValue(element.Contact, AlignmentType.LEFT)],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 2500, type: WidthType.DXA },
              shading: {
                color: '#f8f8f9',
                type: ShadingType.SOLID,
                fill: '#f8f8f9',
              },
            }),
            new TableCell({
              children: [
                CreateTableValue(
                  moment(new Date(element.NotifiedTime)).format(
                    'MMMM DD, YYYY - hh:mmA',
                  ),
                  AlignmentType.LEFT,
                ),
              ],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 2500, type: WidthType.DXA },
              shading: {
                color: '#f8f8f9',
                type: ShadingType.SOLID,
                fill: '#f8f8f9',
              },
            }),
          ],
        }),
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        children: [
          // Page Title
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'Incident Report - ' +
                  moment(CreatedAt).format('DD/MM/YYYY | hh:mm a'),
                font: 'Calibri',
                color: '#000000',
                bold: true,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(''),
          new Paragraph(''),
          // Header Table
          new Table({
            alignment: AlignmentType.CENTER,
            columnWidths: [3000, 3000, 3000],
            rows: [
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },

                children: [
                  new TableCell({
                    children: [CreateTableHeader('Incident Reporter')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 3000, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [CreateTableHeader('Date Submitted')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 3000, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [CreateTableHeader('Time Submitted')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 3000, type: WidthType.DXA },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.3in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    children: [CreateTableCell(Reporter)],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    children: [CreateTableCell(moment(CreatedAt).format('DD/MM/YYYY'))],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    children: [CreateTableCell(moment(CreatedAt).format('hh:mm a'))],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph(''),
          new Paragraph(''),
          new Paragraph(''),
          // Reporter Datail Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'Reporter Detail',
                font: 'Calibri',
                color: '#000000',
                bold: true,
                underline: {
                  color: '#ffd020',
                  type: UnderlineType.THICK,
                },
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(''),
          // Reporter Datail Table
          new Table({
            alignment: AlignmentType.CENTER,
            columnWidths: [5000, 5000],
            borders: {
              bottom: { style: BorderStyle.NONE },
              top: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Your Name')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.Name)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('position / Title')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.Position)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey(dto.ContactType)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.Contact)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph(''),
          new Paragraph(''),
          new Paragraph(''),
          // Incident Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'Incident',
                font: 'Calibri',
                color: '#000000',
                bold: true,
                underline: {
                  color: '#ffd020',
                  type: UnderlineType.THICK,
                },
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(''),
          // Incident Table
          new Table({
            alignment: AlignmentType.CENTER,
            columnWidths: [5000, 5000],
            borders: {
              bottom: { style: BorderStyle.NONE },
              top: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey('Time and date incident occurred:'),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [
                      CreateTableValue(
                        moment(new Date(dto.IncidentDate)).format(
                          'MMMM DD, YYYY - hh:mmA',
                        ),
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Duration of incident:')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.IncidentDuration)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Who was affected?')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.Affected.join(' , '))],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Type of incident:')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.IncidentType.join(' , '))],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey(
                        'names and contact details of people affected',
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10000, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                    columnSpan: 2,
                  }),
                ],
              }),

              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Name')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableKey('Contact detail')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),

              ...AffectedPersonTable,

              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey(
                        'Clear, concise and factual account of the incident',
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10000, type: WidthType.DXA },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                    columnSpan: 2,
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableValue(
                        dto.IncidentDescription,
                        AlignmentType.LEFT,
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                    columnSpan: 2,
                  }),
                ],
              }),
            ],
          }),
        ],
      },
      {
        children: [
          // Action Taken Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'Action Taken',
                font: 'Calibri',
                color: '#000000',
                bold: true,
                underline: {
                  color: '#ffd020',
                  type: UnderlineType.THICK,
                },
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(''),
          // Action Taken
          new Table({
            alignment: AlignmentType.CENTER,
            columnWidths: [2500, 2500, 2500, 2500],
            borders: {
              bottom: { style: BorderStyle.NONE },
              top: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey('Were emergency services in attendance?'),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [
                      CreateTableValue(dto.EmergencyService.join(' , ')),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Duration of incident:')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.IncidentDuration)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Who was affected?')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.Affected.join(' , '))],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Type of incident:')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.IncidentType.join(' , '))],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),

              // Inner Table
              // Table Header Title
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('notified person detail')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10000, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                    columnSpan: 4,
                  }),
                ],
              }),
              // Table Header Cells
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Name')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableKey('Role')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableKey('Contact Detail')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableKey('Time/Date notified')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 2500, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              // Table Values
              ...NotifiedPersonTable,
              // Next Simple Row
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey('If no one was notified – why / why not?'),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10000, type: WidthType.DXA },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                    columnSpan: 4,
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableValue(
                        dto.NotifiedDescription,
                        AlignmentType.LEFT,
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10000, type: WidthType.DXA },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                    columnSpan: 4,
                  }),
                ],
              }),
              // Next
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey('Time and date that report submitted'),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [
                      CreateTableValue(
                        moment().format('MMMM DD, YYYY - hh:mmA'),
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    columnSpan: 2,
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph(''),
          new Paragraph(''),
          new Paragraph(''),
          // Office Use only Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'Office use only',
                font: 'Calibri',
                color: '#000000',
                bold: true,
                underline: {
                  color: '#ffd020',
                  type: UnderlineType.THICK,
                },
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph(''),
          // Office Use only Table
          new Table({
            alignment: AlignmentType.CENTER,
            columnWidths: [5000, 5000],
            borders: {
              bottom: { style: BorderStyle.NONE },
              top: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey(
                        'Sunflower Support Services representative name & title',
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.OfficeName)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Phone number')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.OfficePhone)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Email')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [CreateTableValue(dto.OfficeEmail)],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [CreateTableKey('Time and date form submitted')],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [
                      CreateTableValue(
                        moment().format('MMM DD, YYYY - hh:mm A'),
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey('Time and date incident followed up'),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { left: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                  new TableCell({
                    children: [
                      CreateTableValue(
                        moment(new Date(dto.IncidentDate)).format(
                          'MMM DD, YYYY - hh:mm A',
                        ),
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#f8f8f9',
                      type: ShadingType.SOLID,
                      fill: '#f8f8f9',
                    },
                  }),
                ],
              }),
              new TableRow({
                height: { value: '0.4in', rule: HeightRule.EXACT },
                children: [
                  new TableCell({
                    children: [
                      CreateTableKey('Reportable to the NDIS Commission'),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                  new TableCell({
                    children: [
                      CreateTableValue(
                        dto.NDISReport[0] + ' - ' + dto.NDISReason,
                      ),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 5000, type: WidthType.DXA },
                    margins: { right: 10 },
                    shading: {
                      color: '#ffffff',
                      type: ShadingType.SOLID,
                      fill: '#ffffff',
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const FileName =
    'Incident-' + moment().format('DD-MM-YYYY|hh-mm-a') + '.docx';

  //   Packer.toBuffer(doc).then((buffer) => {
  //     fs.writeFileSync('public/Incident/' + FileName, buffer);
  //   });

  const b64String = await Packer.toBase64String(doc);

  const SibApiV3Sdk = require('sib-api-v3-typescript');

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey =
    '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';

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = 'NEW INCIDENT REPORT ADDED!';
  sendSmtpEmail.sender = {
    name: 'Sunflower Auto Mail System',
    email: 'devsunflowers@gmail.com',
  };
  sendSmtpEmail.to = [
    { email: 'mrwebdevir@gmail.com', name: 'Dev' },
    { email: 'fatima.azimi777@yahoo.com', name: 'Fatima' },
    { email: 'info@sunflowersupportservices.com.au', name: 'Sunflower Info' },
  ];
  sendSmtpEmail.templateId = 3;
  sendSmtpEmail.attachment = [
    {
      content: b64String,
      name: FileName,
    },
  ];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log(
      'API called successfully. Returned data: ' + JSON.stringify(data),
    );
  });
};

export default CreateDocx;
