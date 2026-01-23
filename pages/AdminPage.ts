import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export interface ReservationCellValues {
  name: string;
  email: string;
  guests: string; // Keep as string to match DOM text; coerce in tests if needed
  date: string;   // yyyy-mm-dd
  time: string;   // HH:mm
}


export class AdminPage extends BasePage {
    
// Static elements
  readonly logoutButton: Locator;
  readonly adminMessage: Locator;

// table

  readonly table: Locator;
  readonly tbody: Locator;
  readonly rows: Locator;

  // Filters
  readonly filterName: Locator;
  readonly filterDate: Locator;
  readonly applyFilters: Locator;

  // Edit modal elements
  readonly editModal: Locator;
  readonly editForm: Locator;
  readonly editId: Locator;
  readonly editName: Locator;
  readonly editEmail: Locator;
  readonly editGuests: Locator;
  readonly editDate: Locator;
  readonly editTime: Locator;
  readonly closeModal: Locator;
  readonly saveButton: Locator;

  constructor(page: Page){

    super(page);

    
// Basic selectors
    this.logoutButton = page.locator('#logout-btn');
    this.adminMessage = page.locator('#admin-message');

    //Table handling    
    this.table = page.locator('#reservations-table');
    this.tbody = this.table.locator('tbody');
    this.rows = this.tbody.locator('tr');

    // Filters
    this.filterName = page.locator('#filter-name');
    this.filterDate = page.locator('#filter-date');
    this.applyFilters = page.locator('#apply-filters');

    // Edit modal
    this.editModal = page.locator('#edit-modal');
    this.editForm = page.locator('#edit-form');
    this.editId = page.locator('#edit-id');
    this.editName = page.locator('#edit-name');
    this.editEmail = page.locator('#edit-email');
    this.editGuests = page.locator('#edit-guests');
    this.editDate = page.locator('#edit-date');
    this.editTime = page.locator('#edit-time');
    this.closeModal = page.locator('#close-modal');
    this.saveButton = this.editForm.locator('button[type="submit"]');

  }

  // ------------------- Navigation ----------------------
  async open() {
        await this.goto('/admin.html');
        await this.waitForPageLoaded();
    }

    
// ---------- Wait / Assertions ----------

async waitForRows(min = 1) {
  await this.page.waitForFunction(
    (count) => document.querySelectorAll('#reservations-table tbody tr').length >= count,
    min
  );
}

  
async expectAdminMessageContains(text: string) {
    await expect(this.adminMessage).toContainText(text);
  }


 
/* ===========================
     Row queries
     =========================== */

     /** Count all data rows */
  async getRowCount(): Promise<number> {
    return this.rows.count();
  }
  
  /** Get row by index (0-based) */
  rowByIndex(index: number): Locator {
    return this.rows.nth(index);
  }

/**
   * Get row by reservation id using <tr data-id="..."> if present,
   * otherwise anchor on a button with data-id and go up to the tr.
   */
  rowById(id: string | number): Locator {
    const byTrDataId = this.tbody.locator(`tr[data-id="${id}"]`);
    // Fallback: find the edit/delete button for id and climb to ancestor tr
    const byButtonAnchor = this.page
      .locator(`[data-testid="edit-btn"][data-id="${id}"], .edit-btn[data-id="${id}"], [data-testid="delete-btn"][data-id="${id}"], .delete-btn[data-id="${id}"]`)
      .locator('xpath=ancestor::tr');
    return byTrDataId.or(byButtonAnchor);
  }
 
 /** First row containing visible text (name or email, etc.) */
  rowByText(text: string): Locator {
    return this.rows.filter({ hasText: text }).first();
  }

  
/* ===========================
     Buttons inside rows
     =========================== */

  /** Returns the Edit button locator within a row (supports testid and class) */
  private editButtonIn(row: Locator): Locator {
    // Comma in CSS is logical OR
    return row.locator('[data-testid="edit-btn"], .edit-btn');
  }
  
  /** Returns the Delete button locator within a row (supports testid and class) */
  private deleteButtonIn(row: Locator): Locator {
    return row.locator('[data-testid="delete-btn"], .delete-btn');
  }
 
// --- Click by index ---
  async clickEditByIndex(index: number): Promise<void> {
    await this.editButtonIn(this.rowByIndex(index)).click();
  }
  async clickDeleteByIndex(index: number): Promise<void> {
    await this.deleteButtonIn(this.rowByIndex(index)).click();
  }
 

 // --- Click by id ---
  async clickEditById(id: string | number): Promise<void> {
    await this.editButtonIn(this.rowById(id)).click();
  }
  async clickDeleteById(id: string | number): Promise<void> {
    await this.deleteButtonIn(this.rowById(id)).click();
  }

  
 // --- Click by visible text (name/email/etc.) ---
  async clickEditByText(text: string): Promise<void> {
    await this.editButtonIn(this.rowByText(text)).click();
  }
  async clickDeleteByText(text: string): Promise<void> {
    await this.deleteButtonIn(this.rowByText(text)).click();
  }


/* ===========================
     Filters
     =========================== */

  async applyFilter(options: { name?: string; date?: string } = {}) {
    const { name, date } = options;
    if (name !== undefined) await this.filterName.fill(name);
    if (date !== undefined) await this.filterDate.fill(date); // yyyy-mm-dd
    await this.applyFilters.click();
  }

  async resetFilters() {
    await this.filterName.fill('');
    await this.filterDate.fill('');
    await this.applyFilters.click();
  }




/* ===========================
     Edit modal workflow
     =========================== */

  async waitForEditModal(open = true) {
    if (open) {
      await this.editModal.waitFor({ state: 'visible' });
    } else {
      await this.editModal.waitFor({ state: 'hidden' });
    }
  }

  async fillEditForm(fields: {
    name?: string;
    email?: string;
    guests?: number | string;
    date?: string; // yyyy-mm-dd
    time?: string; // HH:mm
  }) {
    const { name, email, guests, date, time } = fields;
    if (name !== undefined) await this.editName.fill(name);
    if (email !== undefined) await this.editEmail.fill(email);
    if (guests !== undefined) await this.editGuests.fill(String(guests));
    if (date !== undefined) await this.editDate.fill(date);
    if (time !== undefined) await this.editTime.fill(time);
  }

  async saveEdit() {
    await this.saveButton.click();
  }

  async cancelEdit() {
    await this.closeModal.click();
  }
  
/* ===========================
     Table cell helpers
     =========================== */

  /**
   * Returns visible textual cell values for a specific reservation id.
   * Order (based on your template): name, email, guests, date, time, (buttons cell)
   */
  async getCellValuesById(id: string | number): Promise<ReservationCellValues> {
    const row = this.rowById(id);
    const cells = row.locator('td');
    const texts = await cells.allInnerTexts();

    return {
      name: texts[0]?.trim() ?? '',
      email: texts[1]?.trim() ?? '',
      guests: texts[2]?.trim() ?? '',
      date: texts[3]?.trim() ?? '',
      time: texts[4]?.trim() ?? '',
    };
  }
    
/**
   * Same as above, but by visible text match (e.g., name or email).
   */
  async getCellValuesByText(text: string): Promise<ReservationCellValues> {
    const row = this.rowByText(text);
    const cells = row.locator('td');
    const texts = await cells.allInnerTexts();

    return {
      name: texts[0]?.trim() ?? '',
      email: texts[1]?.trim() ?? '',
      guests: texts[2]?.trim() ?? '',
      date: texts[3]?.trim() ?? '',
      time: texts[4]?.trim() ?? '',
    };
  }
}