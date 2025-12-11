/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   print.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

void	print_status(t_philo *philo, const char *msg)
{
	long long	timestamp;
	const char	*color;

	pthread_mutex_lock(&philo->data->write_lock);
	if (!is_dead(philo->data))
	{
		timestamp = get_time() - philo->data->start_time;
		if (msg[0] == 'h')
			color = GREEN;
		else if (msg[0] == 'i' && msg[3] == 'e')
			color = PURPLE;
		else if (msg[0] == 'i' && msg[3] == 's')
			color = YELLOW;
		else if (msg[0] == 'i' && msg[3] == 't')
			color = BLUE;
		else
			color = RED;
		printf("%s%lld %d %s%s\n", color, timestamp, philo->id, msg, RESET);
	}
	pthread_mutex_unlock(&philo->data->write_lock);
}

// void	print_status(t_philo *philo, const char *color, const char *msg)
// {
// 	long long	timestamp;
// 	long long	last_meal;

// 	pthread_mutex_lock(&philo->data->write_lock);
// 	if (!is_dead(philo->data))
// 	{
// 		timestamp = get_time() - philo->data->start_time;
// 		pthread_mutex_lock(&philo->data->meal_lock);
// 		last_meal = get_time() - philo->last_meal_time;
// 		pthread_mutex_unlock(&philo->data->meal_lock);
// 		printf("%s%lld [P%d] (eat=%d, last=%lldms) %s%s\n",
// 			color,
// 			timestamp,
// 			philo->id,
// 			philo->eat_count,
// 			last_meal,
// 			msg,
// 			RESET);
// 	}
// 	pthread_mutex_unlock(&philo->data->write_lock);
// }
