import { FilterBar } from "./FilterBar";
import { usePulseItems } from "../../hooks/usePulseItems";
import { MOCK_ITEMS } from "../../data/pulse-items.mock";

const state = usePulseItems(MOCK_ITEMS);

<FilterBar
  searchQuery={state.searchQuery}
  setSearchQuery={state.setSearchQuery}
  statusFilter={state.statusFilter}
  setStatusFilter={state.setStatusFilter}
  priorityFilter={state.priorityFilter}
  setPriorityFilter={state.setPriorityFilter}
  sortBy={state.sortBy}
  setSortBy={state.setSortBy}
/>;
