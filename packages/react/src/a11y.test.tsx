import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Button } from './Button.js';
import { Alert } from './Alert.js';
import { Badge } from './Badge.js';
import { Progress } from './Progress.js';
import { Pagination } from './Pagination.js';
import { SegmentedControl } from './SegmentedControl.js';
import { Avatar } from './Avatar.js';
import { Field, FieldLabel, FieldHelp } from './Field.js';
import { Input } from './Input.js';
import { Card, CardHeader, CardTitle, CardBody } from './Card.js';
import { Table } from './Table.js';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownGroup,
} from './Dropdown.js';

async function violationIds(ui: React.ReactElement): Promise<string[]> {
  const { container } = render(ui);
  // `region`/`color-contrast` are document-scope or layout-dependent and can't
  // be evaluated meaningfully for an isolated component in jsdom.
  const results = await axe(container, {
    rules: {
      region: { enabled: false },
      'color-contrast': { enabled: false },
    },
  });
  return results.violations.map((v) => v.id);
}

describe('a11y (axe) smoke tests', () => {
  it('Button has no violations', async () => {
    expect(await violationIds(<Button intent="primary">Save</Button>)).toEqual([]);
  });

  it('Alert has no violations', async () => {
    expect(
      await violationIds(
        <Alert intent="info" title="Heads up">
          Your trial ends soon.
        </Alert>,
      ),
    ).toEqual([]);
  });

  it('Badge has no violations', async () => {
    expect(await violationIds(<Badge intent="success">Active</Badge>)).toEqual([]);
  });

  it('Progress has no violations', async () => {
    expect(await violationIds(<Progress value={60} />)).toEqual([]);
  });

  it('Pagination has no violations', async () => {
    expect(await violationIds(<Pagination page={2} count={6} onPageChange={() => {}} />)).toEqual(
      [],
    );
  });

  it('SegmentedControl has no violations', async () => {
    expect(
      await violationIds(
        <SegmentedControl
          aria-label="View"
          defaultValue="list"
          options={[
            { label: 'List', value: 'list' },
            { label: 'Grid', value: 'grid' },
          ]}
        />,
      ),
    ).toEqual([]);
  });

  it('Avatar has no violations', async () => {
    expect(await violationIds(<Avatar fallback="AL" />)).toEqual([]);
  });

  it('Field + FieldLabel + Input is correctly associated', async () => {
    expect(
      await violationIds(
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input />
          <FieldHelp>We never share it.</FieldHelp>
        </Field>,
      ),
    ).toEqual([]);
  });

  it('Table has no violations', async () => {
    expect(
      await violationIds(
        <Table striped>
          <thead>
            <tr>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ada</td>
            </tr>
          </tbody>
        </Table>,
      ),
    ).toEqual([]);
  });

  it('Dropdown with a checkable group has no violations', async () => {
    expect(
      await violationIds(
        <Dropdown defaultOpen>
          <DropdownTrigger>View</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem value="reload">Reload</DropdownItem>
            <DropdownGroup label="Panels">
              <DropdownItem role="menuitemcheckbox" value="sidebar" checked>
                Sidebar
              </DropdownItem>
            </DropdownGroup>
          </DropdownMenu>
        </Dropdown>,
      ),
    ).toEqual([]);
  });

  it('Card with a heading has no violations', async () => {
    expect(
      await violationIds(
        <Card>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
          </CardHeader>
          <CardBody>Pro tier</CardBody>
        </Card>,
      ),
    ).toEqual([]);
  });
});
