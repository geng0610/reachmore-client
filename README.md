Here's the full README with the updated flow, reflecting the iterative approach and delaying customer insights until after a few rounds of audience generation:

---

# Reachmore

**Reachmore** is a marketing automation tool for small businesses, designed to help them identify, understand, and reach potential customers. It leverages Primer's extensive contact database (over 300 million contacts hosted in Clickhouse) to generate custom audiences based on a business's current customers. 

## Core Features

### 1. **Customer Analysis**
- Allow small businesses to share a list of their customers via free-form input.
- Analyze these customers using Primer's contact database to provide insights on demographics, firmographics, and behavior.

### 2. **Potential Customer Generation**
- Using Primer's contact database, generate a list of potential customers who share similar profiles to the business’s existing customers.
- The list is adjustable, allowing the user to upvote or downvote contacts to refine the results based on custom preferences.

### 3. **Ad Audience Creation & Export**
- Once the potential customer list is refined, enable the user to export the list to ad platforms such as Facebook or Google Ads for targeted advertising.

---

## Basic Flow

### **Step 1: Upload Customer List**
- Businesses share a free-form list of their top customers by copy/pasting the data (including name, company, email, etc.).
- The data is cross-referenced with Primer's database to enrich the information.

### **Step 2: Generate Potential Audience**
- A recommendation engine uses the enriched customer data to generate a new list of potential customers from Primer's database.
- Users can review this audience list and refine it using a Tinder-style UI, where they upvote or downvote contacts to indicate preferences.
- The system adjusts weights on attributes like geography, job role, and industry based on user feedback to generate an improved audience list.
- This iteration may occur several times to refine the audience to the user’s satisfaction.

### **Step 3: Customer Insights**
- After refining the audience list through a few iterations, present a comprehensive dashboard with insights.
- Key metrics include:
  - Geographic distribution
  - Industry
  - Job roles
  - Company sizes
- These insights will be based on both the original customer data and the refined potential audience list.

### **Step 4: Push to Ad Platforms**
- Once the user is satisfied with the refined audience list, they can export it to platforms such as Facebook or Google Ads using API integrations for custom audience creation.

---

## Key Features

### **1. List Upload and Audience Creation**

#### Frontend Components:

1. **FreeFormInputComponent**:
   - Provides an input text area where users can paste customer data.
   - Includes a submit button to send the data to the backend for processing.

2. **ContactListComponent**:
   - Displays the generated audience list based on the seed customer data.
   - Allows the user to upvote or downvote individual contacts to refine the list.

3. **SummaryComponent**:
   - Reflects back the final list of contacts after user refinement.
   - Displays insights like geographical distribution and job role summary.

#### Backend (Node.js + Clickhouse):

1. **Store the Seed Contacts**:
   - API to accept and store the free-form list of customer data.

2. **Generate Contacts from Clickhouse**:
   - Using the stored customer data, generate a new list of similar contacts from Clickhouse.
   - Leverage ChatGPT to turn the free-form contact data into a SQL query, focusing on matching attributes like company domain, name, and job role.

3. **Capture Feedback and Adjust Weights**:
   - Allow users to upvote or downvote contacts in the generated list.
   - Adjust weighting logic dynamically based on user feedback to fine-tune the search criteria.

4. **Summarize the Final List**:
   - Return the final adjusted contact list, along with a summary of key insights, to the frontend.

---

### **2. Customer Insights Dashboard**

#### Frontend:

- Build a dashboard that displays detailed insights about the business’s current customers and the refined audience.
- Insights may include:
  - Key demographic and firmographic data (location, industry, etc.).
  - Visuals such as pie charts and graphs for easy interpretation of customer and audience distribution.

#### Backend:

- Fetch enriched customer data from the Clickhouse database.
- Aggregate and return the data for visualization on the frontend.

---

### **3. Generate Potential Audience**

#### Frontend:

- Create a view for potential customers based on existing customer data.
- Provide the ability for users to adjust the list by adding/removing individuals or filtering based on custom preferences.

#### Backend:

- Build a recommendation engine using ChatGPT to generate a SQL query from the initial seed data.
- Provide API endpoints to return the suggested audience list and handle user feedback (upvote/downvote).
- Adjust filters and query logic based on the user's feedback to refine the list further.

---

### **4. Push Audience to Ad Platforms**

#### Frontend:

- Once the audience list is finalized, allow users to export it to ad platforms like Facebook.

#### Backend:

- Integrate with Facebook Ads API (or other platforms like Google Ads) to create and push the custom audience for ad targeting.

---

### Additional Notes:

- **Query Generation**: The system uses ChatGPT to dynamically generate SQL queries based on free-form contact input. This provides flexibility and adaptability when the input data varies.
- **Weight Adjustment**: The system captures user preferences via upvotes/downvotes and adjusts weights for attributes like proximity, industry, and job role, allowing continuous refinement of the audience.
- **Multiple Queries Per Audience List**: Each audience list may have multiple queries, but the latest query is always used to generate the most relevant contacts.

---

## Future Enhancements

- **Additional Ad Platforms**: Expand the export functionality to more platforms such as LinkedIn or TikTok Ads.
- **Enhanced Filtering**: Provide more granular control over filtering options for users who want deeper customization.
- **Advanced Weighting**: Implement machine learning models to further enhance the weight adjustment logic based on more complex user behaviors.

---

This README serves as both a product requirement document and technical spec, outlining the overall functionality and technical approach of Reachmore.

---