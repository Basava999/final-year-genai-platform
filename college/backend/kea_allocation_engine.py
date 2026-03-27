def kea_allocation_algorithm(applicants, seats):
    """
    Implements the KEA-inspired seat allotment algorithm based on merit ranks and
    preference category matching.
    """
    allocated_seats = {}
    remaining_seats = seats.copy()

    # Sorting applicants based on merit rank
    sorted_applicants = sorted(applicants, key=lambda x: x['merit_rank'])

    for applicant in sorted_applicants:
        category = applicant['category']
        preferences = applicant['preferences']

        for preference in preferences:
            if preference in remaining_seats and remaining_seats[preference] > 0:
                allocated_seats[applicant['id']] = preference
                remaining_seats[preference] -= 1
                break

    return allocated_seats


# Example usage
applicants = [
    {'id': 1, 'merit_rank': 2, 'category': 'general', 'preferences': ['CSE', 'ECE']},
    {'id': 2, 'merit_rank': 1, 'category': 'OBC', 'preferences': ['ECE', 'CSE']},
    {'id': 3, 'merit_rank': 3, 'category': 'SC', 'preferences': ['ME', 'CSE']}
]
seats = {'CSE': 1, 'ECE': 1, 'ME': 1}
allocated = kea_allocation_algorithm(applicants, seats)
print(allocated)  # Expected to show allocation based on merit and preference